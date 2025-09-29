// // client/src/services/UserService.ts

// export interface Department {
//   id: number;
//   name: string;
//   slug: string;
// }

// export interface UserFormData {
//   name: string;
//   email: string;
//   password: string;
//   department_id: string;
// }

// export const UserService = {
//   async getDepartments(): Promise<Department[]> {
//     const res = await api.get("/departments", {
//       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//     });
//     return res.data;
//   },

//   async createUser(data: UserFormData) {
//     const res = await api.post("/users", data, {
//       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//     });
//     return res.data;
//   },
// };
