// src/front/pages/Dashboard.jsx
import React, { useEffect } from 'react';
import useGlobalReducer from "../hooks/useGlobalReducer";
import { WorkOrderForm } from "../components/WorkOrderForm";
import { WorkOrderChart } from "../components/WorkOrderChart";

export const Dashboard = () => {
  const { store, dispatch } = useGlobalReducer();

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/work-orders`, {
          headers: {
            'Authorization': `Bearer ${store.auth.token}`
          }
        });
        
        const data = await response.json();
        
        if (response.ok) {
          dispatch({ type: 'set_work_orders', payload: data.work_orders || [] });
        }
      } catch (error) {
        console.log('Failed to fetch work orders');
      }
    };

    if (store.auth.isAuthenticated) {
      fetchWorkOrders();
    }
  }, [store.auth.isAuthenticated, store.auth.token, dispatch]);

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

  return (
    <div className="container mt-4">
      <h1>Dashboard</h1>
      
      <div className="row">
        <div className="col-md-8">
          <WorkOrderForm />
        </div>
        <div className="col-md-4">
          <WorkOrderChart />
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Recent Work Orders</h3>
              {(!store.workOrders || store.workOrders.length === 0) ? (
                <p className="text-muted">No work orders yet</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Vehicle</th>
                        <th>License Plate</th>
                        <th>Stage</th>
                        <th>Est. Completion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {store.workOrders.map((order) => (
                        <tr key={order.id}>
                          <td>{order.id}</td>
                          <td>{order.year} {order.make} {order.model}</td>
                          <td>{order.license_plate}</td>
                          <td>
                            <span 
                              className="badge"
                              style={{ backgroundColor: getStageColor(order.current_stage) }}
                            >
                              {order.current_stage}
                            </span>
                          </td>
                          <td>{order.est_completion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};