import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import moment from "moment";
import { MdModeEdit } from "react-icons/md";
import ChangeUserRole from "../components/ChangeUserRole";

const AllUsers = () => {
  const [allUser, setAllUsers] = useState([]);
  const [openUpdateRole, setOpenUpdateRole] = useState(false);
  const [updateUserDetails, setUpdateUserDetails] = useState({
    email: "",
    name: "",
    role: "",
    _id: "",
  });

  const fetchAllUsers = async () => {
    const fetchData = await fetch(SummaryApi.allUser.url, {
      method: SummaryApi.allUser.method,
      credentials: "include",
    });

    const dataResponse = await fetchData.json();

    if (dataResponse.success) {
      setAllUsers(dataResponse.data);
    }

    if (dataResponse.error) {
      toast.error(dataResponse.message);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div className="w-full h-full pt-2">
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-purple-200 text-purple-900 text-left">
              <th className="px-4 py-3 text-sm font-semibold">Sr.</th>
              <th className="px-4 py-3 text-sm font-semibold">Name</th>
              <th className="px-4 py-3 text-sm font-semibold">Email</th>
              <th className="px-4 py-3 text-sm font-semibold">Role</th>
              <th className="px-4 py-3 text-sm font-semibold">Created Date</th>
              <th className="px-4 py-3 text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {allUser.map((el, index) => (
              <tr
                key={el._id}
                className={`text-gray-700 text-sm hover:bg-purple-50 transition ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2 font-medium">{el?.name}</td>
                <td className="px-4 py-2">{el?.email}</td>
                <td className="px-4 py-2 capitalize">{el?.role}</td>
                <td className="px-4 py-2">
                  {moment(el?.createdAt).format("LL")}
                </td>
                <td className="px-4 py-2">
                  <button
                    className="p-2 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-300 hover:text-purple-900 transition"
                    onClick={() => {
                      setUpdateUserDetails(el);
                      setOpenUpdateRole(true);
                    }}
                  >
                    <MdModeEdit size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openUpdateRole && (
        <ChangeUserRole
          onClose={() => setOpenUpdateRole(false)}
          name={updateUserDetails.name}
          email={updateUserDetails.email}
          role={updateUserDetails.role}
          userId={updateUserDetails._id}
          callFunc={fetchAllUsers}
        />
      )}
    </div>
  );
};

export default AllUsers;
