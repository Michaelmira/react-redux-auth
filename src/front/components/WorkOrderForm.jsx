import React, { useState } from 'react';
import useGlobalReducer from "../hooks/useGlobalReducer";

export const WorkOrderForm = () => {
  const { store, dispatch } = useGlobalReducer();
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    color: '',
    vin: '',
    license_plate: '',
    est_completion: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/work-order`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${store.auth.token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        dispatch({ type: 'add_work_order', payload: data.work_order });
        setFormData({
          make: '',
          model: '',
          year: '',
          color: '',
          vin: '',
          license_plate: '',
          est_completion: ''
        });
        alert('Work order created successfully!');
      } else {
        alert(data.msg);
      }
    } catch (error) {
      alert('Failed to create work order');
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">Create Work Order</h3>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <input
                type="text"
                name="make"
                className="form-control"
                value={formData.make}
                onChange={handleChange}
                placeholder="Make (e.g., Toyota)"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="text"
                name="model"
                className="form-control"
                value={formData.model}
                onChange={handleChange}
                placeholder="Model (e.g., Camry)"
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <input
                type="text"
                name="year"
                className="form-control"
                value={formData.year}
                onChange={handleChange}
                placeholder="Year (e.g., 2020)"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="text"
                name="color"
                className="form-control"
                value={formData.color}
                onChange={handleChange}
                placeholder="Color (e.g., Red)"
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="vin"
              className="form-control"
              value={formData.vin}
              onChange={handleChange}
              placeholder="VIN Number"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="license_plate"
              className="form-control"
              value={formData.license_plate}
              onChange={handleChange}
              placeholder="License Plate"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Estimated Completion Date</label>
            <input
              type="date"
              name="est_completion"
              className="form-control"
              value={formData.est_completion}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Create Work Order</button>
        </form>
      </div>
    </div>
  );
};