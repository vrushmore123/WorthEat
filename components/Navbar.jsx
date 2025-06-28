"use client";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  ChevronDown,
  LogOut,
  Menu,
  X,
  User,
  ShoppingBag,
  Bot,
  Calendar,
  UtensilsCrossed,
  Sparkles,
  Star,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import WortheatIMG from "../assets/NoBG.svg";

const Navbar = ({ mealType, setMealType }) => {
  const { customerId, vendorId } = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHealthDropdownOpen, setIsHealthDropdownOpen] = useState(false);

  // Determine if the current route is myOrders
  const isMyOrdersPage = pathname.includes("myOrders");

  useEffect(() => {
    const getUserInfo = async () => {
      if (!customerId) return;

      try {
        const resUserExists = await fetch(
          `/api/getUserInfo?customerId=${customerId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!resUserExists.ok) {
          toast.error(`Error: ${resUserExists.status}`);
          return;
        }

        const text = await resUserExists.text();
        const userData = text ? JSON.parse(text) : null;

        setUsername(userData?.user.firstName + " " + userData?.user.lastName);
        setEmail(userData?.user.email);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    getUserInfo();
  }, [customerId]);

  const handleLogOut = () => {
    localStorage.removeItem("customer");
    router.push("/onboardingcustomer/login");
  };

  const handleNavigation = (route) => {
    setIsSidebarOpen(false);
    if (!vendorId || vendorId === "null") {
      toast.error("Vendor ID is missing!");
      return;
    }
    if (route === "planYourOrder") {
      router.push(`/calender/${vendorId}/${customerId}`);
      return;
    }
    if (["breakfast", "snacks", "Lunch", "specials"].includes(route)) {
      router.push(`/booking/${customerId}/${vendorId}/${route}`);
      return;
    }
    if (route === "myOrders") {
      router.push(`/${route}/${customerId}`);
      return;
    }

    router.push(`/booking/${customerId}/${vendorId}/${route}`);
  };

  const handleHealthNavigation = (option) => {
    setIsSidebarOpen(false);
    setIsHealthDropdownOpen(false);
    if (!customerId) {
      toast.error("Customer ID is missing!");
      return;
    }
    router.push(`/health/${customerId}/${option}`);
  };

  // Navigation menu items
  const navItems = [
    { name: "Breakfast", route: "breakfast" },
    { name: "Snacks", route: "snacks" },
    { name: "Lunch/Dinner", route: "Lunch/Dinner" },
    { name: "Specials", route: "specials" },
    {
      name: "Plan Order",
      route: "planYourOrder",
      icon: <Calendar size={18} />,
    },
    { name: "Discounts", route: "discount" },
    { name: "My Orders", route: "myOrders", icon: <ShoppingBag size={18} /> },
  ];

  // AI Meal Planner options
  const aiMealPlannerOptions = [
    {
      name: "Smart Dish Recommender",
      route: "dish-recommender",
      description: "AI-powered dish suggestions",
    },
    {
      name: "Personalized Meal Planner",
      route: "meal-planner",
      description: "Custom meal plans for you",
    },
    {
      name: "Nutrition Analyzer",
      route: "nutrition-checker",
      description: "Track your nutrition goals",
    },
    {
      name: "Diet Optimizer",
      route: "recommend",
      description: "Optimize your daily diet",
    },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            href={`/booking/${customerId}/${vendorId}/breakfast`}
            className="flex-shrink-0 flex items-center transition-transform duration-200 hover:scale-105"
          >
            <Image
              src={WortheatIMG}
              alt="Wortheat Logo"
              className="w-[130px] md:w-[160px]"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {isMyOrdersPage ? (
              <>
                <button
                  key="myOrders"
                  className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-all duration-200 shadow-sm"
                  onClick={() => handleNavigation("myOrders")}
                >
                  <ShoppingBag size={18} className="mr-2" />
                  My Orders
                </button>

                {/* AI Meal Planner - Featured */}
                <div className="relative ml-4">
                  <button
                    className={`flex items-center px-5 py-2.5 text-sm font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${
                      isHealthDropdownOpen ? "ring-2 ring-purple-300" : ""
                    }`}
                    onClick={() =>
                      setIsHealthDropdownOpen(!isHealthDropdownOpen)
                    }
                  >
                    <Bot size={20} className="mr-2" />
                    <Sparkles size={16} className="mr-1" />
                    AI Meal Planner
                    <ChevronDown
                      size={16}
                      className={`ml-2 transition-transform duration-200 ${
                        isHealthDropdownOpen ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isHealthDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-80 rounded-xl shadow-2xl bg-white ring-1 ring-black ring-opacity-10 transition-all z-50 border border-gray-100">
                      <div className="p-3">
                        <div className="flex items-center mb-3 px-2">
                          <Bot className="text-purple-600 mr-2" size={18} />
                          <span className="text-sm font-semibold text-gray-800">
                            AI-Powered Features
                          </span>
                          <Star className="text-yellow-500 ml-auto" size={16} />
                        </div>
                        {aiMealPlannerOptions.map((option, index) => (
                          <button
                            key={option.route}
                            onClick={() => handleHealthNavigation(option.route)}
                            className="block w-full text-left px-3 py-3 mb-1 text-sm rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200 group"
                          >
                            <div className="font-medium text-gray-800 group-hover:text-purple-700">
                              {option.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 group-hover:text-purple-600">
                              {option.description}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* AI Meal Planner - Featured (Primary Position) */}
                <div className="relative mr-2">
                  <button
                    className={`flex items-center px-5 py-2.5 text-sm font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${
                      isHealthDropdownOpen ? "ring-2 ring-purple-300" : ""
                    }`}
                    onClick={() =>
                      setIsHealthDropdownOpen(!isHealthDropdownOpen)
                    }
                  >
                    <Bot size={20} className="mr-2" />
                    <Sparkles size={16} className="mr-1" />
                    AI Meal Planner
                    <ChevronDown
                      size={16}
                      className={`ml-2 transition-transform duration-200 ${
                        isHealthDropdownOpen ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isHealthDropdownOpen && (
                    <div className="absolute left-0 mt-3 w-80 rounded-xl shadow-2xl bg-white ring-1 ring-black ring-opacity-10 transition-all z-50 border border-gray-100">
                      <div className="p-3">
                        <div className="flex items-center mb-3 px-2">
                          <Bot className="text-purple-600 mr-2" size={18} />
                          <span className="text-sm font-semibold text-gray-800">
                            AI-Powered Features
                          </span>
                          <Star className="text-yellow-500 ml-auto" size={16} />
                        </div>
                        {aiMealPlannerOptions.map((option, index) => (
                          <button
                            key={option.route}
                            onClick={() => handleHealthNavigation(option.route)}
                            className="block w-full text-left px-3 py-3 mb-1 text-sm rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200 group"
                          >
                            <div className="font-medium text-gray-800 group-hover:text-purple-700">
                              {option.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 group-hover:text-purple-600">
                              {option.description}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Regular Navigation Items */}
                <div className="flex items-center space-x-1">
                  {navItems.map((item) => (
                    <button
                      key={item.route}
                      className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                        pathname.includes(item.route)
                          ? "bg-orange-500 text-white shadow-sm"
                          : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                      }`}
                      onClick={() => handleNavigation(item.route)}
                    >
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      {item.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* User Profile Section */}
          {customerId && (
            <div className="hidden lg:flex items-center ml-4">
              <div className="relative">
                <button
                  className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg border transition-all duration-200 ${
                    isDropdownOpen
                      ? "bg-gray-50 border-gray-300 shadow-sm"
                      : "text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mr-3">
                    <User size={16} className="text-white" />
                  </div>
                  <div className="text-left">
                    <div className="max-w-[120px] truncate font-medium">
                      {userName}
                    </div>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`ml-2 transition-transform duration-200 ${
                      isDropdownOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-xl shadow-xl bg-white ring-1 ring-black ring-opacity-10 transition-all border border-gray-100">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                          <User size={20} className="text-white" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-semibold text-gray-900">
                            {userName}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 truncate max-w-[180px]">
                            {email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={handleLogOut}
                        className="flex w-full items-center px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LogOut size={18} className="mr-3" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="inline-flex items-center justify-center p-2.5 rounded-lg text-gray-700 hover:text-orange-500 hover:bg-gray-100 focus:outline-none transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <Image
                src={WortheatIMG}
                alt="Wortheat Logo"
                className="w-[120px]"
              />
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="rounded-full p-2 hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto h-full pb-24">
              {/* User Profile in Mobile */}
              {customerId && (
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                      <User size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900">
                        {userName}
                      </p>
                      <p className="text-sm text-gray-500 truncate max-w-[200px]">
                        {email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-5">
                {/* AI Meal Planner - Featured in Mobile */}
                <div className="mb-6">
                  <button
                    className="flex items-center justify-center w-full px-4 py-3 mb-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                    onClick={() =>
                      setIsHealthDropdownOpen(!isHealthDropdownOpen)
                    }
                  >
                    <Bot size={20} className="mr-2" />
                    <Sparkles size={16} className="mr-1" />
                    AI Meal Planner
                    <ChevronDown
                      size={16}
                      className={`ml-auto transition-transform duration-200 ${
                        isHealthDropdownOpen ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isHealthDropdownOpen && (
                    <div className="space-y-2 ml-4">
                      {aiMealPlannerOptions.map((option) => (
                        <button
                          key={option.route}
                          onClick={() => handleHealthNavigation(option.route)}
                          className="flex flex-col items-start w-full px-3 py-2.5 text-sm rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200"
                        >
                          <div className="font-medium text-gray-800">
                            {option.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {option.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Regular Menu Items */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Menu
                  </p>
                  {isMyOrdersPage ? (
                    <button
                      key="myOrders"
                      className="flex items-center w-full px-4 py-3 rounded-lg text-white bg-orange-500 text-sm font-medium"
                      onClick={() => handleNavigation("myOrders")}
                    >
                      <ShoppingBag size={20} className="mr-3" />
                      My Orders
                    </button>
                  ) : (
                    navItems.map((item) => (
                      <button
                        key={item.route}
                        className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          pathname.includes(item.route)
                            ? "bg-orange-500 text-white"
                            : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                        }`}
                        onClick={() => handleNavigation(item.route)}
                      >
                        {item.icon ? (
                          <span className="mr-3">{item.icon}</span>
                        ) : (
                          <div className="w-5 h-5 mr-3" />
                        )}
                        {item.name}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Sign Out Button */}
              {customerId && (
                <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-gray-100 bg-white">
                  <button
                    onClick={handleLogOut}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <LogOut size={18} className="mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
