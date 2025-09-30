import AxiosInstance from "./AxiosInstances";

export interface DepartmentOption {
    id: number;
    name: string;
}

export interface CreateUserPayload {
    name: string;
    email: string;
    password: string;
    department_id: number;
}

const UserServices = {
    async listDepartments(): Promise<DepartmentOption[]> {
        const res = await AxiosInstance.get("/departments");
        return res.data;
    },

    async listUsers() {
        const res = await AxiosInstance.get("/users");
        return res.data;
    },

    async createUser(payload: CreateUserPayload) {
        const res = await AxiosInstance.post("/users", payload);
        return res.data;
    },
};

export default UserServices;
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
