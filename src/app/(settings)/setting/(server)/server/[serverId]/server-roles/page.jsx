import { HiMiniUsers } from "react-icons/hi2";
import { IoSearchOutline } from "react-icons/io5";
const serverRoles = () => {
  const roles = [
    { name: "MEE6", members: 1 },
    { name: ".", members: 5 },
    { name: "admin", members: 1 },
    { name: "moderator", members: 7 },
  ];

  return (
    <div className="text-indigo-500 p-6 h-full">
      <h2 className="text-xl font-bold flex"><HiMiniUsers className="my-auto mr-2" size={25} />Roles</h2>
      <p className="text-sm text-indigo-500">
        Use roles to group your server members and assign permissions.
      </p>

      {/* Search Roles */}
      <div className="flex items-center mt-4">
        <div className="flex flex-1 rounded pl-4 pr-2 py-[5px] bg-gray-50 border border-indigo-500">
          <input
            type="text"
            placeholder="Search Roles"
            className="bg-transparent text-sm w-full focus:outline-none flex-1 placeholder:text-indigo-400 text-indigo-500"
          />
          <div className="mx-1">|</div>
          <div className="flex items-center">
            <IoSearchOutline className="" size={25} />
          </div>
        </div>
        <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-sm py-2 px-4 ml-2 rounded whitespace-nowrap">
          Create Role
        </button>
      </div>


      {/* working */}

      <p className="text-sm text-gray-400 mt-4">
        Members use the color of the highest role they have on this list. Drag
        roles to reorder them.{" "}
        <a
          href="#"
          className="text-blue-500 hover:underline"
        >
          Need help with permissions?
        </a>
      </p>
    </div>
  );
}

export default serverRoles