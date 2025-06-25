import React, { useRef, useEffect } from 'react';
import cytoscape from 'cytoscape';
import {
  Compass,
  Route,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Users,
  Monitor
} from 'lucide-react';

// Import the complete mind map data from the data file
import { mindMapData, mindMapConnections } from './data';
// Import the extracted Cytoscape configuration
import { cytoscapeStyles, cytoscapeLayout } from './cytoscapeConfig';

interface KnowledgeMapViewProps {
  explorationPaths: any[];
  explorationPath: any[];
  selectedNodeId: string | null;
  onShowPaths: () => void;
  onSelectPath: (path: any) => void;
  onExplorePath: () => void;
  onNodeSelect: (nodeId: string) => void;
  pathToHighlight: any;
  onShowMapWithPath: (path: any) => void;
  onShowMap: () => void;
  onAddPathToDesktop: (path: any) => void;
}

const KnowledgeMapView: React.FC<KnowledgeMapViewProps> = ({
  explorationPaths,
  explorationPath,
  selectedNodeId,
  onShowPaths,
  onExplorePath,
  onNodeSelect,
  pathToHighlight,
  onShowMap,
  onAddPathToDesktop
}) => {
  const cyRef = useRef<cytoscape.Core | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Cytoscape
  useEffect(() => {
    if (containerRef.current && !cyRef.current) {
      // Create nodes and edges for cytoscape
      const nodes = mindMapData.map(node => ({
        data: {
          id: node.id,
          label: node.label,
          type: node.type,
          description: node.description || '',
          parentId: (node as any).parentId || '',
          step: (node as any).step || 0
        },
        classes: node.type === 'alternative' ? 'alternative' : ''
      }));

      const edges = mindMapConnections.map(connection => ({
        data: {
          id: `${connection.source}-${connection.target}`,
          source: connection.source,
          target: connection.target,
          pathId: connection.pathId
        },
        classes: connection.pathId === 'alternative' ? 'alternative-edge' : ''
      }));

      cyRef.current = cytoscape({
        container: containerRef.current,
        elements: [...nodes, ...edges],
        // @ts-ignore
        style: cytoscapeStyles,
        layout: cytoscapeLayout,

        // User interaction settings
        userZoomingEnabled: true,
        userPanningEnabled: true,
        boxSelectionEnabled: false,
        selectionType: 'single',
        touchTapThreshold: 8,
        desktopTapThreshold: 4,
        autolock: false,
        autoungrabify: false,
        autounselectify: false,

        // Zoom settings
        minZoom: 0.1,
        maxZoom: 3.0,
        wheelSensitivity: 0.1
      });

      // Node click handler with alternative visibility and path highlighting
      cyRef.current.on('tap', 'node', (evt) => {
        const node = evt.target;
        const nodeData = node.data();

        // Add to exploration path (only for non-alternative nodes)
        if (nodeData.type !== 'alternative') {
          onNodeSelect(nodeData.id);
        }

        // Clear previous selections and alternatives (but preserve path highlighting if from auto-highlight)
        cyRef.current?.elements().removeClass('selected visible');

        // Select the clicked node
        node.addClass('selected');

        // Highlight the entire path if this is a path node (manual click)
        if (nodeData.type === 'path1' || nodeData.type === 'path2' || nodeData.type === 'path3' || nodeData.type === 'hub') {
          const pathType = nodeData.type === 'hub' ? 'hub' : nodeData.type;

          // Only clear and re-add path highlighting if this is a manual click (not auto-highlight)
          if (!pathToHighlight) {
            cyRef.current?.elements().removeClass('path-highlighted');

            // Get all nodes in the same path
            const pathNodes = cyRef.current?.nodes().filter(n => {
              const nData = n.data();
              if (pathType === 'hub') {
                return nData.type === 'hub';
              }
              return nData.type === pathType;
            });

            // Get all edges connecting nodes in this path
            const pathEdges = cyRef.current?.edges().filter(e => {
              const edgeData = e.data();
              if (pathType === 'hub') {
                return false; // Hub doesn't have path edges
              }

              // Check if edge connects nodes in the same path
              const sourceNode = cyRef.current?.getElementById(edgeData.source);
              const targetNode = cyRef.current?.getElementById(edgeData.target);

              if (sourceNode && targetNode) {
                const sourceType = sourceNode.data('type');
                const targetType = targetNode.data('type');

                // Include edges that connect hub to path or within the same path
                return (sourceType === 'hub' && targetType === pathType) ||
                       (sourceType === pathType && targetType === pathType) ||
                       (sourceType === pathType && targetType === 'hub');
              }
              return false;
            });

            // Highlight path nodes and edges
            if (pathNodes) {
              pathNodes.addClass('path-highlighted');
            }
            if (pathEdges) {
              pathEdges.addClass('path-highlighted');
            }
          }
        }

        // Show alternative options for this node
        const alternativeNodes = cyRef.current?.nodes().filter(n => n.data('parentId') === nodeData.id);
        const alternativeEdges = cyRef.current?.edges().filter(e =>
          e.data('source') === nodeData.id && e.data('pathId') === 'alternative'
        );

        // Make alternative nodes and edges visible
        if (alternativeNodes && alternativeNodes.length > 0) {
          alternativeNodes.addClass('visible');
        }
        if (alternativeEdges && alternativeEdges.length > 0) {
          alternativeEdges.addClass('visible');
        }

        // Don't auto-center to prevent map jumping - let users control the view manually
      });

      // Click on background to hide all alternatives and path highlighting
      cyRef.current.on('tap', (evt) => {
        if (evt.target === cyRef.current) {
          cyRef.current?.elements().removeClass('selected visible path-highlighted');
          onNodeSelect('');
          // Clear the auto-highlight state if it exists
          if (pathToHighlight) {
            // We need to clear the pathToHighlight in the parent component
            // We can do this by calling onShowPaths and then onShowMap to reset the state
            onShowMap();
          }
        }
      });

      // Initial fit
      setTimeout(() => {
        cyRef.current?.fit();
      }, 100);
    }

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }
    };
  }, []);

  // Handle automatic path highlighting when pathToHighlight is provided
  useEffect(() => {
    if (cyRef.current && pathToHighlight) {
      // Small delay to ensure cytoscape is fully initialized
      setTimeout(() => {
        if (!cyRef.current) return;

        // Clear previous selections and highlighting
        cyRef.current.elements().removeClass('selected visible path-highlighted');

        // Determine path type from the pathToHighlight
        let pathType = '';
        if (pathToHighlight.id === 'demographics-utilization') {
          pathType = 'path1';
        } else if (pathToHighlight.id === 'medication-patterns') {
          pathType = 'path2';
        } else if (pathToHighlight.id === 'clinical-outcomes') {
          pathType = 'path3';
        }

        if (pathType) {
          // Get all nodes in the path
          const pathNodes = cyRef.current.nodes().filter(n => {
            const nData = n.data();
            return nData.type === pathType || nData.type === 'hub';
          });

          // Get all edges connecting nodes in this path
          const pathEdges = cyRef.current.edges().filter(e => {
            const edgeData = e.data();
            const sourceNode = cyRef.current?.getElementById(edgeData.source);
            const targetNode = cyRef.current?.getElementById(edgeData.target);

            if (sourceNode && targetNode) {
              const sourceType = sourceNode.data('type');
              const targetType = targetNode.data('type');

              // Include edges that connect hub to path or within the same path
              return (sourceType === 'hub' && targetType === pathType) ||
                     (sourceType === pathType && targetType === pathType) ||
                     (sourceType === pathType && targetType === 'hub');
            }
            return false;
          });

          // Highlight path nodes and edges
          if (pathNodes) {
            pathNodes.addClass('path-highlighted');
          }
          if (pathEdges) {
            pathEdges.addClass('path-highlighted');
          }

          // Select the last node if selectedNodeId is provided
          if (selectedNodeId) {
            const selectedNode = cyRef.current.getElementById(selectedNodeId);
            if (selectedNode) {
              selectedNode.addClass('selected');
              // Also call the onNodeSelect to update the parent state
              onNodeSelect(selectedNodeId);

              // Show alternative options for the selected node (same logic as click handler)
              const nodeData = selectedNode.data();
              const alternativeNodes = cyRef.current?.nodes().filter(n => n.data('parentId') === nodeData.id);
              const alternativeEdges = cyRef.current?.edges().filter(e =>
                e.data('source') === nodeData.id && e.data('pathId') === 'alternative'
              );

              // Make alternative nodes and edges visible
              if (alternativeNodes && alternativeNodes.length > 0) {
                alternativeNodes.addClass('visible');
              }
              if (alternativeEdges && alternativeEdges.length > 0) {
                alternativeEdges.addClass('visible');
              }
            }
          }
        }
      }, 100);
    }
  }, [pathToHighlight, selectedNodeId]);

  // Zoom controls
  const handleZoomIn = () => cyRef.current?.zoom(cyRef.current.zoom() * 1.25);
  const handleZoomOut = () => cyRef.current?.zoom(cyRef.current.zoom() * 0.8);
  const handleReset = () => {
    if (cyRef.current) {
      cyRef.current.fit();
      cyRef.current.center();
    }
  };

  // Handle legend path highlighting
  const handleLegendPathClick = (pathType: string) => {
    if (!cyRef.current) return;

    // Clear previous selections and highlighting
    cyRef.current.elements().removeClass('selected visible path-highlighted');

    if (pathType === 'hub') {
      // Highlight just the hub
      const hubNode = cyRef.current.getElementById('patients-dataset');
      if (hubNode) {
        hubNode.addClass('path-highlighted selected');
      }
    } else {
      // Get all nodes in the specified path
      const pathNodes = cyRef.current.nodes().filter(n => {
        const nData = n.data();
        return nData.type === pathType || nData.type === 'hub';
      });

      // Get all edges connecting nodes in this path
      const pathEdges = cyRef.current.edges().filter(e => {
        const edgeData = e.data();
        const sourceNode = cyRef.current?.getElementById(edgeData.source);
        const targetNode = cyRef.current?.getElementById(edgeData.target);

        if (sourceNode && targetNode) {
          const sourceType = sourceNode.data('type');
          const targetType = targetNode.data('type');

          // Include edges that connect hub to path or within the same path
          return (sourceType === 'hub' && targetType === pathType) ||
                 (sourceType === pathType && targetType === pathType) ||
                 (sourceType === pathType && targetType === 'hub');
        }
        return false;
      });

      // Highlight path nodes and edges
      if (pathNodes) {
        pathNodes.addClass('path-highlighted');
      }
      if (pathEdges) {
        pathEdges.addClass('path-highlighted');
      }
    }

    // Clear any existing pathToHighlight state
    onShowMap();
  };

  // Helper function to get path data by path type
  const getPathByType = (pathType: string) => {
    if (pathType === 'path1') {
      return explorationPaths.find(p => p.id === 'demographics-utilization');
    } else if (pathType === 'path2') {
      return explorationPaths.find(p => p.id === 'medication-patterns');
    } else if (pathType === 'path3') {
      return explorationPaths.find(p => p.id === 'clinical-outcomes');
    }
    return null;
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm">
        <Compass size={20} className="text-blue-600" />
        <h1 className="text-xl font-bold text-gray-800">Data Explorer</h1>
        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={onShowPaths}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Route size={16} />
            Guided Analysis
          </button>
          <div className="text-sm text-gray-500">
            Click nodes to explore • {explorationPath.length} topics in path
          </div>
          <button
            onClick={onExplorePath}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Route size={16} />
            Analyze Path
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 relative">
        {/* Cytoscape container */}
        <div ref={containerRef} className="w-full h-full" />

        {/* Zoom controls */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-2">
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={16} className="text-gray-600" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={16} className="text-gray-600" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Reset View"
          >
            <RotateCcw size={16} className="text-gray-600" />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-24 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-4 max-w-xs">
          <h3 className="font-semibold text-gray-900 mb-3">Map Legend</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleLegendPathClick('path1')}
                className="flex-1 flex items-center gap-2 text-left p-2 rounded hover:bg-gray-50 transition-colors"
              >
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#3b82f6' }}
                >
                  <Users size={8} className="text-white" />
                </div>
                <span className="text-gray-700">Customer & Usage Analysis</span>
              </button>
              <button
                onClick={() => {
                  const path = getPathByType('path1');
                  if (path) onAddPathToDesktop(path);
                }}
                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-all duration-200 flex-shrink-0"
                title="Add Customer & Usage Analysis to desktop"
              >
                <Monitor size={12} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleLegendPathClick('path2')}
                className="flex-1 flex items-center gap-2 text-left p-2 rounded hover:bg-gray-50 transition-colors"
              >
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#10b981' }}
                >
                  <Route size={8} className="text-white" />
                </div>
                <span className="text-gray-700">Operations & Safety Analysis</span>
              </button>
              <button
                onClick={() => {
                  const path = getPathByType('path2');
                  if (path) onAddPathToDesktop(path);
                }}
                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-all duration-200 flex-shrink-0"
                title="Add Operations & Safety Analysis to desktop"
              >
                <Monitor size={12} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleLegendPathClick('path3')}
                className="flex-1 flex items-center gap-2 text-left p-2 rounded hover:bg-gray-50 transition-colors"
              >
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#ef4444' }}
                >
                  <Route size={8} className="text-white" />
                </div>
                <span className="text-gray-700">Clinical Outcomes & Quality</span>
              </button>
              <button
                onClick={() => {
                  const path = getPathByType('path3');
                  if (path) onAddPathToDesktop(path);
                }}
                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-all duration-200 flex-shrink-0"
                title="Add Clinical Outcomes & Quality to desktop"
              >
                <Monitor size={12} />
              </button>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Click paths to highlight • Click <Monitor size={10} className="inline mx-1" /> to add to desktop
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeMapView;
