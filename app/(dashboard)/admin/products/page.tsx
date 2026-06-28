"use client";
import {
  CustomButton,
  DashboardProductTable,
  DashboardSidebar,
} from "@/components";
import React from "react";

const DashboardProducts = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 max-xl:flex-col">
      <DashboardSidebar />
        <DashboardProductTable />
    </div>
  );
};

export default DashboardProducts;
