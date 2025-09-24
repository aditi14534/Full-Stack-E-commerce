import React, { useContext, useState } from "react";
import Bluvia from "../assest/Bluvia.png";
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { setUserDetails, logoutUser } from "../store/userSlice"; // logoutUser import karo
import ROLE from "../common/role";
import Context from "../context";

const Header = () => {
  const user = useSelector((state) => state?.user?.user);
  const context = useContext(Context);
  const dispatch = useDispatch();
  const [menuDisplay, setMenuDisplay] = useState(false);
  const navigate = useNavigate();
  const searchInput = useLocation();
  const URLSearch = new URLSearchParams(searchInput?.search);
  const searchQuery = URLSearch.getAll("q");
  const [search, setSearch] = useState(searchQuery);

  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: "include",
    });

    const data = await fetchData.json();

    if (data.success) {
      toast.success(data.message);
      // Redux store reset karo
      dispatch(logoutUser());
      // Cart count bhi reset karo
      context.fetchUserAddToCart();
      navigate("/");
    }

    if (data.error) {
      toast.error(data.message);
    }
  };

  // Baaki code same rahega...
  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);

    if (value) {
      navigate(`/search?q=${value}`);
    } else {
      navigate("/search");
    }
  };

  return (
    <header className="h-16 shadow-md bg-white fixed w-full z-40">
      <div className="h-full container mx-auto flex items-center px-4 justify-between">
        {/* 🔹 Logo */}
        <div className="flex-shrink-0">
          <Link to={"/"}>
            <img
              src={Bluvia}
              alt="Site Logo"
              className="w-[120px] h-[85px] object-contain"
            />
          </Link>
        </div>

        {/* 🔹 Search Bar */}
        <div className="hidden lg:flex items-center w-full max-w-md bg-white rounded-full shadow-md border border-gray-300 focus-within:border-indigo-300 focus-within:ring-1 focus-within:ring-indigo-300 transition duration-300">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-3 py-2 text-sm text-gray-700 bg-transparent outline-none rounded-l-full placeholder-gray-400"
            onChange={handleSearch}
            value={search}
          />
          <div className="text-lg min-w-[45px] h-9 flex items-center justify-center rounded-r-full text-indigo-800 hover:bg-indigo-50 transition">
            <GrSearch />
          </div>
        </div>

        {/* 🔹 Right Side */}
        <div className="flex items-center gap-6">
          {/* Profile */}
          <div className="relative flex justify-center">
            {user?._id && (
              <div
                className="text-3xl cursor-pointer relative flex justify-center"
                onClick={() => setMenuDisplay((preve) => !preve)}
              >
                {user?.profilePic ? (
                  <img
                    src={user?.profilePic}
                    className="w-10 h-10 rounded-full"
                    alt={user?.name}
                  />
                ) : (
                  <FaRegCircleUser />
                )}
              </div>
            )}

            {menuDisplay && (
              <div className="absolute bg-white top-full left-1/2 transform -translate-x-1/2 mt-2 min-w-max shadow-lg rounded-lg border border-gray-200 overflow-hidden z-50">
                <nav>
                  {user?.role === ROLE.ADMIN && (
                    <Link
                      to={"/admin-panel/all-products"}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition duration-200"
                      onClick={() => setMenuDisplay((preve) => !preve)}
                    >
                      Admin Panel
                    </Link>
                  )}
                </nav>
              </div>
            )}
          </div>

          {/* Cart */}
          {user?._id && (
            <Link to={"/cart"} className="text-2xl relative">
              <span>
                <FaShoppingCart />
              </span>

              <div className="bg-red-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3">
                <p className="text-sm">{context?.cartProductCount}</p>
              </div>
            </Link>
          )}

          {/* Login / Logout Button */}
          <div>
            {user?._id ? (
              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition duration-300 shadow-md"
              >
                Logout
              </button>
            ) : (
              <Link
                to={"/login"}
                className="px-5 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition duration-300 shadow-md"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
// import React, { useContext, useState } from "react";
// import Bluvia from "../assest/Bluvia.png";
// import { GrSearch } from "react-icons/gr";
// import { FaRegCircleUser } from "react-icons/fa6";
// import { FaShoppingCart } from "react-icons/fa";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import SummaryApi from "../common";
// import { toast } from "react-toastify";
// import { setUserDetails } from "../store/userSlice";
// import ROLE from "../common/role";
// import Context from "../context";
// const Header = () => {
//   const user = useSelector((state) => state?.user?.user);
//   const context = useContext(Context);
//   const dispatch = useDispatch();
//   const [menuDisplay, setMenuDisplay] = useState(false);
//   const navigate = useNavigate();
//   const searchInput = useLocation();
//   const URLSearch = new URLSearchParams(searchInput?.search);
//   const searchQuery = URLSearch.getAll("q");
//   const [search, setSearch] = useState(searchQuery);

//   const handleLogout = async () => {
//     const fetchData = await fetch(SummaryApi.logout_user.url, {
//       method: SummaryApi.logout_user.method,
//       credentials: "include",
//     });

//     const data = await fetchData.json();

//     if (data.success) {
//       toast.success(data.message);
//       dispatch(setUserDetails(null));
//       navigate("/");
//     }

//     if (data.error) {
//       toast.error(data.message);
//     }
//   };

//   const handleSearch = (e) => {
//     const { value } = e.target;
//     setSearch(value);

//     if (value) {
//       navigate(`/search?q=${value}`);
//     } else {
//       navigate("/search");
//     }
//   };

//   return (
//     <header className="h-16 shadow-md bg-white fixed w-full z-40">
//       <div className="h-full container mx-auto flex items-center px-4 justify-between">
//         {/* 🔹 Logo */}
//         <div className="flex-shrink-0">
//           <Link to={"/"}>
//             <img
//               src={Bluvia}
//               alt="Site Logo"
//               className="w-[120px] h-[85px] object-contain"
//             />
//           </Link>
//         </div>

//         {/* 🔹 Search Bar */}
//         <div className="hidden lg:flex items-center w-full max-w-md bg-white rounded-full shadow-md border border-gray-300 focus-within:border-indigo-300 focus-within:ring-1 focus-within:ring-indigo-300 transition duration-300">
//           <input
//             type="text"
//             placeholder="Search products..."
//             className="w-full px-3 py-2 text-sm text-gray-700 bg-transparent outline-none rounded-l-full placeholder-gray-400"
//             onChange={handleSearch}
//             value={search}
//           />
//           <div className="text-lg min-w-[45px] h-9 flex items-center justify-center rounded-r-full text-indigo-800 hover:bg-indigo-50 transition">
//             <GrSearch />
//           </div>
//         </div>

//         {/* 🔹 Right Side */}
//         <div className="flex items-center gap-6">
//           {/* Profile */}
//           <div className="relative flex justify-center">
//             {user?._id && (
//               <div
//                 className="text-3xl cursor-pointer relative flex justify-center"
//                 onClick={() => setMenuDisplay((preve) => !preve)}
//               >
//                 {user?.profilePic ? (
//                   <img
//                     src={user?.profilePic}
//                     className="w-10 h-10 rounded-full"
//                     alt={user?.name}
//                   />
//                 ) : (
//                   <FaRegCircleUser />
//                 )}
//               </div>
//             )}

//             {menuDisplay && (
//               <div className="absolute bg-white top-full left-1/2 transform -translate-x-1/2 mt-2 min-w-max shadow-lg rounded-lg border border-gray-200 overflow-hidden z-50">
//                 <nav>
//                   {user?.role === ROLE.ADMIN && (
//                     <Link
//                       to={"/admin-panel/all-products"}
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition duration-200"
//                       onClick={() => setMenuDisplay((preve) => !preve)}
//                     >
//                       Admin Panel
//                     </Link>
//                   )}
//                 </nav>
//               </div>
//             )}
//           </div>

//           {/* Cart */}

//           {user?._id && (
//             <Link to={"/cart"} className="text-2xl relative">
//               <span>
//                 <FaShoppingCart />
//               </span>

//               <div className="bg-red-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3">
//                 <p className="text-sm">{context?.cartProductCount}</p>
//               </div>
//             </Link>
//           )}

//           {/* Login / Logout Button */}
//           <div>
//             {user?._id ? (
//               <button
//                 onClick={handleLogout}
//                 className="px-5 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition duration-300 shadow-md"
//               >
//                 Logout
//               </button>
//             ) : (
//               <Link
//                 to={"/login"}
//                 className="px-5 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition duration-300 shadow-md"
//               >
//                 Login
//               </Link>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
