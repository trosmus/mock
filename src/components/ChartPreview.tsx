import React, { useMemo, useCallback, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import type { ChartConfig } from '../types/index';
import { mockQueryResults } from '../mocks/mockData';

interface ChartPreviewProps {
  config: ChartConfig;
  dataframeId: string;
  height?: string;
  demoData?: {
    columns: string[];
    data: any[][];
    totalRows: number;
  };
  onSeriesClick?: (seriesData: {
    name: string;
    data: any[];
    chartType: string;
    sourceWidget: string;
  }, event?: { clientX: number; clientY: number }) => void;
}

const ChartPreview: React.FC<ChartPreviewProps> = React.memo(({ 
  config, 
  dataframeId, 
  height = '300px',
  demoData,
  onSeriesClick
}) => {
  const chartRef = useRef<any>(null);
  const isClickingRef = useRef(false);
  const lastSeriesDataRef = useRef<any>(null);

  const chartOption = useMemo(() => {
    // Use demo data if provided, otherwise fall back to mock data
    const data = demoData || mockQueryResults[dataframeId];
    if (!data) return {};

    // Find column indices
    const xIndex = data.columns.indexOf(config.x);
    const yIndex = data.columns.indexOf(config.y);
    const groupIndex = config.groupBy ? data.columns.indexOf(config.groupBy) : -1;

    if (xIndex === -1 || yIndex === -1) return {};

    // Process data based on chart type
    switch (config.type) {
      case 'bar':
        if (groupIndex !== -1) {
          // Grouped bar chart
          const groups = [...new Set(data.data.map(row => row[groupIndex]))];
          const categories = [...new Set(data.data.map(row => row[xIndex]))];
          
          const series = groups.map(group => ({
            name: group,
            type: 'bar',
            data: categories.map(category => {
              const row = data.data.find(r => r[xIndex] === category && r[groupIndex] === group);
              return row ? row[yIndex] : 0;
            }),
            itemStyle: {
              borderRadius: [4, 4, 0, 0]
            }
          }));

          return {
            title: {
              text: config.title,
              left: 'center',
              textStyle: { fontSize: 14, fontWeight: 'normal' }
            },
            tooltip: { trigger: 'axis' },
            legend: { 
              bottom: 0,
              textStyle: { fontSize: 12 }
            },
            grid: { 
              top: 40, 
              bottom: 50, 
              left: 40, 
              right: 20,
              containLabel: true 
            },
            xAxis: {
              type: 'category',
              data: categories,
              axisLabel: { fontSize: 11 }
            },
            yAxis: {
              type: 'value',
              axisLabel: { fontSize: 11 }
            },
            series
          };
        } else {
          // Simple bar chart
          const chartData = data.data.map(row => ({
            name: row[xIndex],
            value: row[yIndex]
          }));

          return {
            title: {
              text: config.title,
              left: 'center',
              textStyle: { fontSize: 14, fontWeight: 'normal' }
            },
            tooltip: { trigger: 'axis' },
            grid: { 
              top: 40, 
              bottom: 30, 
              left: 40, 
              right: 20,
              containLabel: true 
            },
            xAxis: {
              type: 'category',
              data: chartData.map(d => d.name),
              axisLabel: { fontSize: 11 }
            },
            yAxis: {
              type: 'value',
              axisLabel: { fontSize: 11 }
            },
            series: [{
              type: 'bar',
              data: chartData.map(d => d.value),
              itemStyle: {
                color: '#5470c6',
                borderRadius: [4, 4, 0, 0]
              }
            }]
          };
        }

      case 'pie':
        const pieData = data.data.map(row => ({
          name: row[xIndex],
          value: row[yIndex]
        }));

        return {
          title: {
            text: config.title,
            left: 'center',
            textStyle: { fontSize: 14, fontWeight: 'normal' }
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            bottom: 0,
            textStyle: { fontSize: 12 }
          },
          series: [{
            name: config.title || 'Data',
            type: 'pie',
            radius: ['30%', '70%'],
            center: ['50%', '45%'],
            data: pieData,
            itemStyle: {
              borderRadius: 4,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false
            }
          }]
        };

      case 'line':
        return {
          title: {
            text: config.title,
            left: 'center',
            textStyle: { fontSize: 14, fontWeight: 'normal' }
          },
          tooltip: { trigger: 'axis' },
          grid: { 
            top: 40, 
            bottom: 30, 
            left: 40, 
            right: 20,
            containLabel: true 
          },
          xAxis: {
            type: 'category',
            data: data.data.map(row => row[xIndex]),
            axisLabel: { fontSize: 11 }
          },
          yAxis: {
            type: 'value',
            axisLabel: { fontSize: 11 }
          },
          series: [{
            type: 'line',
            data: data.data.map(row => row[yIndex]),
            smooth: true,
            itemStyle: { color: '#5470c6' },
            lineStyle: { width: 3 }
          }]
        };

      case 'scatter':
        const scatterData = data.data.map(row => [row[xIndex], row[yIndex]]);
        
        return {
          title: {
            text: config.title,
            left: 'center',
            textStyle: { fontSize: 14, fontWeight: 'normal' }
          },
          tooltip: { 
            trigger: 'item',
            formatter: function(params: any) {
              return `${config.x}: ${params.value[0]}<br/>${config.y}: ${params.value[1]}`;
            }
          },
          grid: { 
            top: 40, 
            bottom: 30, 
            left: 40, 
            right: 20,
            containLabel: true 
          },
          xAxis: {
            type: 'value',
            name: config.x,
            axisLabel: { fontSize: 11 }
          },
          yAxis: {
            type: 'value',
            name: config.y,
            axisLabel: { fontSize: 11 }
          },
          series: [{
            type: 'scatter',
            data: scatterData,
            itemStyle: { 
              color: '#5470c6',
              opacity: 0.7 
            },
            symbolSize: 8
          }]
        };

      default:
        return {};
    }
  }, [config, dataframeId, demoData]);

  const handleChartElementClick = useCallback((params: any, instance: any, event: any) => {
    if (!onSeriesClick || isClickingRef.current) return;
    
    console.log('=== ECharts Click Event Debug ===');
    console.log('Full params object:', params);
    console.log('params.name:', params?.name);
    console.log('params.seriesName:', params?.seriesName);
    console.log('Chart config type:', config.type);
    console.log('================================');
    
    // Extract series data based on chart type and clicked element
    let seriesName = 'Unknown Series';
    
    // For different chart types, extract the appropriate name
    switch (config.type) {
      case 'bar':
        // For bar charts, params.name contains the category name (e.g., "Asthma", "Depression")
        seriesName = params.name || params.seriesName || 'Unknown Bar';
        break;
      case 'pie':
        // For pie charts, params.name contains the slice name
        seriesName = params.name || 'Unknown Slice';
        break;
      case 'line':
        // For line charts, use series name or point name
        seriesName = params.seriesName || params.name || 'Unknown Point';
        break;
      case 'scatter':
        // For scatter plots, create a descriptive name
        seriesName = `Point (${params.value?.[0]}, ${params.value?.[1]})`;
        break;
      default:
        seriesName = params.name || params.seriesName || 'Unknown Series';
    }
    
    const seriesData = {
      name: seriesName,
      data: [{ name: params.name, value: params.value }],
      chartType: config.type,
      sourceWidget: config.title || 'Unknown Widget'
    };
    
    // Store the series data for the container handler to use
    lastSeriesDataRef.current = seriesData;
    console.log('ECharts: Stored series data for container handler:', seriesData);
    
    // Check if we have a proper mouse event with coordinates
    const mouseEvent = event?.event;
    const hasValidCoordinates = mouseEvent && (
      (mouseEvent.clientX !== undefined && mouseEvent.clientY !== undefined) ||
      (mouseEvent.pageX !== undefined && mouseEvent.pageY !== undefined) ||
      (mouseEvent.offsetX !== undefined && mouseEvent.offsetY !== undefined)
    );
    
    console.log('ECharts handler - has valid coordinates:', hasValidCoordinates);
    
    // If we don't have valid coordinates, let the container handler deal with it
    if (!hasValidCoordinates) {
      console.log('ECharts handler: No valid coordinates, letting container handler take over');
      return;
    }
    
    isClickingRef.current = true;
    
    // Get mouse coordinates from the event
    console.log('=== COORDINATE DEBUG ===');
    console.log('Mouse event details:', {
      mouseEvent,
      clientX: mouseEvent?.clientX,
      pageX: mouseEvent?.pageX,
      offsetX: mouseEvent?.offsetX,
      screenX: mouseEvent?.screenX,
      layerX: mouseEvent?.layerX,
      layerY: mouseEvent?.layerY,
      x: mouseEvent?.x,
      y: mouseEvent?.y
    });
    
    // Also check ECharts specific coordinates
    console.log('ECharts event details:', {
      event,
      eventType: event?.type,
      offsetX: event?.offsetX,
      offsetY: event?.offsetY,
      zrX: event?.zrX,
      zrY: event?.zrY
    });
    
    let coordinates;
    
    // Get the chart container's position
    const chartContainer = chartRef.current?.getEchartsInstance()?.getDom() || instance?.getDom();
    const rect = chartContainer?.getBoundingClientRect();
    
    console.log('Chart container rect:', rect);
    
    if (mouseEvent) {
      // Try different coordinate sources in order of preference
      if (mouseEvent.clientX !== undefined && mouseEvent.clientY !== undefined && 
          mouseEvent.clientX !== 0 && mouseEvent.clientY !== 0) {
        coordinates = {
          clientX: mouseEvent.clientX,
          clientY: mouseEvent.clientY
        };
        console.log('✓ Using clientX/clientY coordinates:', coordinates);
      } else if (mouseEvent.pageX !== undefined && mouseEvent.pageY !== undefined &&
                 mouseEvent.pageX !== 0 && mouseEvent.pageY !== 0) {
        coordinates = {
          clientX: mouseEvent.pageX - window.scrollX,
          clientY: mouseEvent.pageY - window.scrollY
        };
        console.log('✓ Using pageX/pageY coordinates:', coordinates);
      } else if (event?.offsetX !== undefined && event?.offsetY !== undefined && rect) {
        // Try ECharts event coordinates
        coordinates = {
          clientX: rect.left + event.offsetX,
          clientY: rect.top + event.offsetY
        };
        console.log('✓ Using ECharts offsetX/offsetY + container position:', coordinates);
      } else if (mouseEvent.offsetX !== undefined && mouseEvent.offsetY !== undefined && rect) {
        // Convert offset coordinates to viewport coordinates
        coordinates = {
          clientX: rect.left + mouseEvent.offsetX,
          clientY: rect.top + mouseEvent.offsetY
        };
        console.log('✓ Using mouseEvent offsetX/offsetY + container position:', coordinates);
      } else if (mouseEvent.layerX !== undefined && mouseEvent.layerY !== undefined && rect) {
        // Try layerX/layerY
        coordinates = {
          clientX: rect.left + mouseEvent.layerX,
          clientY: rect.top + mouseEvent.layerY
        };
        console.log('✓ Using layerX/layerY + container position:', coordinates);
      } else if (rect) {
        // Fallback to center of chart
        coordinates = {
          clientX: rect.left + rect.width / 2,
          clientY: rect.top + rect.height / 2
        };
        console.log('✓ Using chart center as fallback:', coordinates);
      } else {
        // Final fallback
        coordinates = {
          clientX: 200,
          clientY: 200
        };
        console.log('✓ Using absolute fallback coordinates:', coordinates);
      }
    } else {
      // Fallback coordinates if no mouse event
      coordinates = {
        clientX: 200,
        clientY: 200
      };
      console.log('✓ No mouse event, using fallback:', coordinates);
    }
    
    console.log('=== FINAL COORDINATES ===', coordinates);
    console.log('========================');
    
    console.log('ECharts calling onSeriesClick with SPECIFIC name:', { seriesName, seriesData, coordinates });
    
    // Mark that we handled this click to prevent container fallback
    if (event?.event) {
      event.event._echartsHandled = true;
    }
    
    // Use setTimeout to ensure the click handling doesn't interfere with chart rendering
    setTimeout(() => {
      onSeriesClick(seriesData, coordinates);
      // Reset the clicking flag after a short delay
      setTimeout(() => {
        isClickingRef.current = false;
      }, 100);
    }, 0);
  }, [onSeriesClick, config.type, config.title]);

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    if (!onSeriesClick) return;
    
    // Check if this click was already handled by ECharts
    const nativeEvent = e.nativeEvent as any;
    if (nativeEvent._echartsHandled) {
      console.log('Click already handled by ECharts, skipping container handler');
      return;
    }
    
    console.log('Container click fallback - ECharts did not handle this click');
    
    // Use the series data stored by ECharts handler if available
    let seriesData;
    if (lastSeriesDataRef.current) {
      seriesData = lastSeriesDataRef.current;
      console.log('Container: Using ECharts series data:', seriesData);
      // Clear the stored data
      lastSeriesDataRef.current = null;
    } else {
      // Fallback to extracting data from chart
      const data = demoData || mockQueryResults[dataframeId];
      let fallbackName = config.title || 'Chart Data';
      
      // For bar charts, try to get a meaningful series name from the data
      if (config.type === 'bar' && data && data.data.length > 0) {
        const xIndex = data.columns.indexOf(config.x);
        if (xIndex !== -1 && data.data[0]) {
          fallbackName = `${data.data[0][xIndex]} (from ${config.title})`;
        }
      }
      
      seriesData = {
        name: fallbackName,
        data: [],
        chartType: config.type,
        sourceWidget: config.title || 'Unknown Widget'
      };
      console.log('Container: Using fallback series data:', seriesData);
    }
    
    const coordinates = {
      clientX: e.clientX,
      clientY: e.clientY
    };
    
    console.log('Container calling onSeriesClick with name:', seriesData.name, 'coordinates:', coordinates);
    
    onSeriesClick(seriesData, coordinates);
  }, [onSeriesClick, demoData, dataframeId, config.type, config.title]);

  if (!chartOption || Object.keys(chartOption).length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <div className="text-center">
          <div className="text-lg mb-2">📊</div>
          <div className="text-sm">No data available</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{ height, width: '100%' }}
      onClick={handleContainerClick}
    >
      <ReactECharts
        ref={chartRef}
        option={chartOption}
        style={{ height: '100%', width: '100%' }}
        opts={{ 
          renderer: 'svg'
        }}
        notMerge={false}
        lazyUpdate={true}
        onEvents={{
          'click': handleChartElementClick
        }}
      />
    </div>
  );
});

export default ChartPreview; 