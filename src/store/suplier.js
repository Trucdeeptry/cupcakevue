import { getToastInstance } from "../plugins/toast";
export default {
  namespaced: true,
  state() {
    return {
      suplier: [],
    };
  },
  getters: {
    suplier(state) {
      return state.suplier;
    },
  },
  actions: {
    async getSuplier(context) {
      context.dispatch("setLoading", true, { root: true });
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/nhacungcap`);
        const Suplier = await response.json();
        context.commit("getSuplier", Suplier);
      } catch (error) {
        console.log("Lỗi:" + error);
      } finally {
        context.dispatch("setLoading", false, { root: true });
      }
    },
    async addItem(context, payload) {
      await fetch(`${import.meta.env.VITE_API_URL}/api/nhacungcap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Suplier Added:", data);
          context.dispatch("getSuplier");
          context.commit("showToast", {
            type: 1,
            crud: "Thêm",
          });
        })
        .catch((error) => {
          console.log("Lỗi khi add Suplier:", error);
          context.commit("showToast", {
            type: 2,
            crud: "Thêm",
          });
        });
    },
    async deleteItem(context, payload) {
      await fetch(`${import.meta.env.VITE_API_URL}/api/nhacungcap/${payload}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Suplier Deleted:", data);
          context.dispatch("getSuplier");
          context.commit("showToast", {
            type: 1,
            crud: "Xóa",
          });
        })
        .catch((error) => {
          console.log("Lỗi khi delete Suplier:", error);
          context.commit("showToast", {
            type: 2,
            crud: "Xóa",
          });
        });
    },
    async updateItem(context, payload) {
      await fetch(`${import.meta.env.VITE_API_URL}/api/nhacungcap/${payload._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Suplier Updated:", data);
          context.dispatch("getSuplier");
          context.commit("showToast", {
            type: 1,
            crud: "Cập nhật",
          });
        })
        .catch((error) => {
          console.log("Lỗi khi update Suplier:", error);
          context.commit("showToast", {
            type: 2,
            crud: "Cập nhật",
          });
        });
    },
  },
  mutations: {
    getSuplier(state, payload) {
      state.suplier = payload;
    },
    showToast(_, payload) {
      const toast = getToastInstance();
      const isSuccess = payload.type == 1 ? true : false;
      toast.add({
        severity: isSuccess ? "success" : "error",
        summary: isSuccess ? "Thành công" : "Thất bại",
        detail: `${payload.crud} nhà cung cấp ${
          isSuccess ? "thành công" : "Thất bại"
        }`,
        life: 3000,
      });
    },
  },
};
