import client from "./client";

export const authApi = {
  register: (formData) =>
    client.post("/users/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  verifyRegister: (payload) => client.post("/users/verify-email-registiration", payload),
  login: (payload) => client.post("/users/login", payload),
  verifyLogin: (payload) => client.post("/users/verify-email-login", payload),
  forgotPassword: (payload) => client.post("/users/forgot-password", payload),
  verifyForgotPassword: (payload) => client.post("/users/verify-email-forgot-password", payload),
  me: () => client.get("/users/me"),
  getForEdit: () => client.get("/users/edit"),
  edit: (formData) =>
    client.patch("/users/edit", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  remove: () => client.delete("/users/delete"),
  all: (params) => client.get("/users/all", { params }),
};

export const itemsApi = {
  list: (params) => client.get("/items", { params }),
  details: (id) => client.get(`/items/${id}/details`),
  getForEdit: (id) => client.get(`/items/${id}/edit`),
  create: (formData) =>
    client.post("/items/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    client.put(`/items/${id}/edit`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  remove: (id) => client.delete(`/items/${id}/delete`),
};

export const commentsApi = {
  forItem: (itemId) => client.get(`/comments/item/${itemId}`),
  create: (itemId, payload) => client.post(`/comments/item/${itemId}`, payload), 
  getForEdit: (commentId) => client.get(`/comments/edit/${commentId}`),
  update: (commentId, payload) => client.put(`/comments/edit/${commentId}`, payload),
  remove: (commentId) => client.delete(`/comments/delete/${commentId}`),
};   
export const payApi = {
  create: (itemId, payload) => client.post(`/payments/${itemId}/createpay`, payload),
  remove: (payId) => client.delete(`/payments/${payId}/deletepay`),
  confirm: (payId) => client.put(`/payments/${payId}/confirm`),
  reject: (payId, reason) => client.put(`/payments/${payId}/reject`, { reason }),
  my: (params) => client.get(`/payments/my`, { params }),
  all: (params) => client.get("/payments/getallpays", { params }),
  unpaid: (params) => client.get("/payments/getisnotpayed", { params }),
};

