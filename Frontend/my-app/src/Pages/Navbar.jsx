import React from "react";

function Navbar({search, setSearch}) {

  const initial = "N";

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-14 flex items-center justify-between gap-4">
          {/* Left: Avatar + Brand */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-semibold">
              {initial}
            </div>
            <span className="text-lg font-semibold text-gray-900">Notify</span>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                name="q"
                placeholder="Search..."
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                className="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <svg
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m21 21-4.35-4.35M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z"
                />
              </svg>
            </div>
          </div>

          {/* Right: Logout */}
          <div className="flex items-center">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-gray-900 text-white text-sm px-4 py-2 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              onClick={()=>{window.location.href="/"}}
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
