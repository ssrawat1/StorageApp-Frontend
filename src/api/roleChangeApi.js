import { axiosWithCreds } from './axiosInstances';

export const roleChange = async ({ roleId, role }) => {
  const { data } = await axiosWithCreds.patch(`/users/${roleId}`, {
    role,
  });
  return data;
};
