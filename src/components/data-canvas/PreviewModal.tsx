import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import { X, Database, Filter, Hash, Code, BarChart3, FileText, Workflow } from 'lucide-react';
import { useCanvasStore } from '../../state/canvasStore';
import WidgetTile from './WidgetTile';
import ExpandedWidgetView from './ExpandedWidgetView';
import { getDemoDataForChart } from './mockData/chartDemoData';
import { getHealthcareWidgets } from './mockData/healthcareWidgets';

interface PreviewModalProps {
  isOpen: boolean;
  nodeId: string | null;
  onClose: () => void;
  onAddDataSeries?: (seriesData: {
    name: string;
    data: any[];
    chartType: string;
    sourceWidget: string;
  }) => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, nodeId, onClose, onAddDataSeries }) => {
  console.log('🔍 PreviewModal render - isOpen:', isOpen, 'nodeId:', nodeId);
  
  const [expandedWidget, setExpandedWidget] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Get the healthcare widgets
  const resultWidgets = getHealthcareWidgets();
  
  // Navigation functions
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % resultWidgets.length);
  };
  
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + resultWidgets.length) % resultWidgets.length);
  };
  
  const handleWidgetClick = (widget: any, index: number) => {
    setExpandedWidget(widget);
    setCurrentIndex(index);
  };
  
  const closeExpanded = () => {
    setExpandedWidget(null);
  };
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!expandedWidget) return;
      
      if (event.key === 'ArrowLeft') {
        goToPrevious();
      } else if (event.key === 'ArrowRight') {
        goToNext();
      } else if (event.key === 'Escape') {
        closeExpanded();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expandedWidget]);
  
  // Update expanded widget when index changes
  useEffect(() => {
    if (expandedWidget) {
      setExpandedWidget(resultWidgets[currentIndex]);
    }
  }, [currentIndex]);
  
  // Early return after all hooks
  if (!nodeId) return null;

  const minSwipeDistance = 50;
  
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  // Mock data for now - you can replace this with actual node data fetching
  const mockNodeData = {
    id: nodeId,
    label: 'Healthcare Analytics Pipeline',
    type: 'dataset',
    description: 'Patient population analysis and clinical insights',
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'dataset': return Database;
      case 'filter': return Filter;
      case 'field': return Hash;
      case 'sql': return Code;
      case 'visualization': return BarChart3;
      case 'narrative': return FileText;
      case 'workflow': return Workflow;
      default: return Database;
    }
  };

  const IconComponent = getCategoryIcon(mockNodeData.type);

  const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '90%',
    bgcolor: 'background.paper',
    borderRadius: 0,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <>
      {!expandedWidget ? (
        <Modal
          open={isOpen}
          onClose={onClose}
          aria-labelledby="preview-modal-title"
          aria-describedby="preview-modal-description"
        >
          <Box sx={modalStyle}>
            {/* Header */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              p: 3, 
              borderBottom: 1, 
              borderColor: 'divider',
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              color: 'white'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  p: 1, 
                  bgcolor: 'rgba(255, 255, 255, 0.2)', 
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <IconComponent size={24} color="white" />
                </Box>
                <Box>
                  <Typography id="preview-modal-title" variant="h5" component="h2" fontWeight="bold" color="inherit">
                    {mockNodeData.label}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    {mockNodeData.description}
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={onClose} size="large" sx={{ color: 'white' }}>
                <X size={20} />
              </IconButton>
            </Box>

            {/* Content - Widget Grid */}
            <Box sx={{ p: 2, overflow: 'auto', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* 3x3 Grid */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: 0.5,
                width: '100%',
                height: '100%',
                maxWidth: '100%',
                maxHeight: '100%'
              }}>
                {resultWidgets.map((widget, index) => (
                  <Box 
                    key={widget.id} 
                    sx={{ 
                      aspectRatio: '1',
                      cursor: 'pointer',
                      width: '100%',
                      height: '100%',
                      minHeight: 0,
                      '&:hover': {
                        opacity: 0.9
                      }
                    }}
                  >
                    <WidgetTile 
                      widget={widget} 
                      getDemoData={getDemoDataForChart}
                      onClick={() => handleWidgetClick(widget, index)}
                      index={index}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Modal>
      ) : null}

      {/* Expanded Widget View */}
      {expandedWidget && (
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <ExpandedWidgetView
            widget={expandedWidget}
            getDemoData={getDemoDataForChart}
            onClose={closeExpanded}
            onNext={goToNext}
            onPrevious={goToPrevious}
            currentIndex={currentIndex}
            totalCount={resultWidgets.length}
            onAddDataSeries={onAddDataSeries}
          />
        </div>
      )}
    </>
  );
};

export default PreviewModal; 