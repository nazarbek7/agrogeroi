"use client";
import { AdminOrders, DashboardSidebar } from "@/components";
import React from "react";

const DashboardOrdersPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 max-xl:flex-col">
      <DashboardSidebar />
      <AdminOrders />
    </div>
  );
};

export default DashboardOrdersPage;
