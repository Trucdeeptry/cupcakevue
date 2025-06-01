let toastInstance = null;

// Hàm để thiết lập instance của $toast
export const setToastInstance = (toast) => {
  toastInstance = toast;
};

// Hàm để lấy instance của $toast
export const getToastInstance = () => toastInstance;
