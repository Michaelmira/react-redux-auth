// src/front/store.js
export const initialStore = () => {
  return {
    auth: {
      isAuthenticated: !!sessionStorage.getItem('access_token'),
      customer: null,
      token: sessionStorage.getItem('access_token') || null
    },
    workOrders: []
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type) {
    case 'login':
      const { token, customer } = action.payload;
      sessionStorage.setItem('access_token', token);
      return {
        ...store,
        auth: {
          isAuthenticated: true,
          customer: customer,
          token: token
        }
      };

    case 'logout':
      sessionStorage.removeItem('access_token');
      return {
        ...store,
        auth: {
          isAuthenticated: false,
          customer: null,
          token: null
        },
        workOrders: []
      };

    case 'set_work_orders':
      return {
        ...store,
        workOrders: action.payload || []
      };

    case 'add_work_order':
      return {
        ...store,
        workOrders: [...(store.workOrders || []), action.payload]
      };

    default:
      return store;
  }    
}