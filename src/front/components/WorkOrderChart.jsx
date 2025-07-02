// src/front/components/WorkOrderChart.jsx
import React from 'react';
import useGlobalReducer from "../hooks/useGlobalReducer";

export const WorkOrderChart = () => {
  const { store } = useGlobalReducer();

  const getStageColor = (stage) => {
    const colors = {
      'Car Accepted': '#ffc107',
      'In Progress': '#17a2b8',
      'Waiting for Parts': '#fd7e14',
      'Quality Check': '#6f42c1',
      'Complete': '#28a745',
      'Delivered': '#20c997'
    };
    return colors[stage] || '#6c757d';
  };

  const workOrders = store.workOrders || [];
  
  const stageCounts = workOrders.reduce((acc, order) => {
    acc[order.current_stage] = (acc[order.current_stage] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">Work Orders by Stage</h3>
        
        {Object.keys(stageCounts).length === 0 ? (
          <p className="text-muted">No work orders yet</p>
        ) : (
          <div>
            {Object.entries(stageCounts).map(([stage, count]) => (
              <div key={stage} className="mb-2">
                <div className="d-flex justify-content-between">
                  <span>{stage}</span>
                  <span>{count}</span>
                </div>
                <div className="progress" style={{ height: '20px' }}>
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: `${(count / workOrders.length) * 100}%`,
                      backgroundColor: getStageColor(stage)
                    }}
                  ></div>
                </div>
              </div>
            ))}
            
            <div className="mt-3">
              <small className="text-muted">Total Work Orders: {workOrders.length}</small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};