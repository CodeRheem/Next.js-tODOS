import Link from "next/link";

const Navbar = () => {
  return (
    <div
      role="navigation"
      className="bg-transparent text-white p-8 flex justify-between items-center font-sans"
    >
      {/* App Name or Logo */}
      <h1 className="text-xl font-bold font-sans text-[#7127b5]">Todo App</h1>
      {/* <AuthButtons /> */}
      {/* Navigation Links */}
      <div>
        <Link
          href="/"
          className="bg-[#7127b5] px-4 py-2 hover:bg-[#551c89] rounded text-xl font-bold font-sans"
        >
          Home
        </Link>
      </div>
    </div>
  );
};

export default Navbar;