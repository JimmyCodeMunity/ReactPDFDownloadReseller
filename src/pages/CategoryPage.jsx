import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import "@react-pdf-viewer/zoom/lib/styles/index.css";
import "jspdf-autotable";
import jsPDF from "jspdf";
import "@react-pdf-viewer/core/lib/styles/index.css";
import axios from "axios";
import { useParams } from "react-router-dom";
var toUint8Array = require("base64-to-uint8array");

const CategoryList = () => {
  const { categoryname } = useParams();
  const categoryName = categoryname;
  const encodedCategoryName = encodeURIComponent(categoryName);

  const [json, setJson] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://res-server-sigma.vercel.app/api/product/productlistcategory/${categoryName}`
      );
      const apidata = response.data;
      setJson(apidata);
      // console.log("products",apidata)
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // `base64String` is the given base 64 data

  // const json = [
  //   {
  //     id: 8418,
  //     start: "2021-10-25T00:00:00.000Z",
  //     end: "2021-10-25T00:00:00.000Z",
  //     duration: "03:00:00",
  //     name: "Absence/Holiday/Etc.",
  //     project: "VARIE",
  //     task: "Hours Off",
  //     comment: "PERMESSO",
  //   },
  //   {
  //     id: 8248,
  //     start: "2021-10-09T00:00:00.000Z",
  //     end: "2021-10-09T00:00:00.000Z",
  //     duration: "03:00:00",
  //     name: "INDRA - AST",
  //     project: "C_17_INDR_03",
  //     task: "Overtime",
  //     comment: "STRAORDINARIO",
  //   },
  //   {
  //     id: 8257,
  //     start: "2021-10-08T00:00:00.000Z",
  //     end: "2021-10-08T00:00:00.000Z",
  //     duration: "08:00:00",
  //     name: "Casillo",
  //     project: "C_17_BUSI_01",
  //     task: "Smart Working",
  //     comment: null,
  //   },
  // ];
  const styles = {
    fontFamily: "sans-serif",
    textAlign: "center",
  };
  const colstyle = {
    width: "30%",
  };
  const tableStyle = {
    width: "100%",
  };

  const getSupplierDataForEachItem = async (item) => {
    try {
      const response = await axios.get(
        `https://res-server-sigma.vercel.app/api/shop/usersdata/${item.supplier}`
      );
      const apiData = response.data;
      const _id = apiData.user._id;
      const exchangeRate = apiData.user.dollarExchangeRate;
      const firstName = apiData.user.firstName;
      const companyName = apiData.user.companyName;
      const lastName = apiData.user.lastName;
      const phoneNumber = apiData.user.phoneNumber;
      const categories = apiData.user.categories.join(", ");
      return {
        ...item,
        exchangeRate,
        firstName,
        phoneNumber,
        categories,
        lastName,
        companyName,
        _id,
      };
    } catch (error) {
      console.error("Error fetching supplier data:", error);
      return item;
    }
  };
  
  const print = async () => {
    if (!json || json.length === 0) {
      console.error("No data available for PDF generation.");
      return;
    }
  
    // Fetch supplier data for all items
    const dataWithSupplierInfo = await Promise.all(
      json.map((item) => getSupplierDataForEachItem(item))
    );
  
    const pdf = new jsPDF("p", "pt", "a4");
    const columns = [
      "Product Name",
      "SKU",
      "Price ($)",
      "Supplier Name",
      "Supplier Phone",
      "Company Name",
    ];
    const rows = dataWithSupplierInfo.map((item) => [
      item.name,
      item.sku,
      item.price,
      `${item.firstName} ${item.lastName}`,
      item.phoneNumber,
      item.companyName,
    ]);
  
    // Use `categoryname` in the PDF title
    pdf.text(235, 40, `ResellerSprint ${categoryname} Product List`);
    pdf.autoTable(columns, rows, {
      startY: 65,
      theme: "grid",
      styles: {
        font: "times",
        halign: "center",
        cellPadding: 3.5,
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
        textColor: [0, 0, 0],
      },
      headStyles: {
        textColor: [0, 0, 0],
        fontStyle: "normal",
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
        fillColor: [166, 204, 247],
      },
      alternateRowStyles: {
        fillColor: [212, 212, 212],
        textColor: [0, 0, 0],
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
      },
      rowStyles: {
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
      },
      tableLineColor: [0, 0, 0],
    });
  
    pdf.save(`${categoryname}_ProductListWithSuppliers.pdf`);
  };
  
  

  const zoomPluginInstance = zoomPlugin();
  const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;
  return (
    <div class="bg-white">
      <header class="absolute inset-x-0 top-0 z-50">
        <nav
          class="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div class="flex lg:flex-1">
            <a 
             href="https://resellersprint.com" 
             target="_blank" 
             rel="noopener noreferrer" 
            class="-m-1.5 p-1.5">
              <span class="text-slate-3xl">ResellerSprint</span>
            </a>
          </div>

          <div class="hidden lg:flex lg:gap-x-12">
            <a href="#" class="text-sm font-semibold leading-6 text-gray-900">
              Company
            </a>
          </div>
          <div class="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="https://resellersprint.com/supplier-login"
             
             target="_blank" 
             rel="noopener noreferrer" class="text-sm font-semibold leading-6 text-gray-900">
              Log in <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </nav>
      </header>

      <div class="relative isolate px-6 pt-14 lg:px-8">
        <div
          class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        <div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div class="hidden sm:mb-8 sm:flex sm:justify-center">
            <div class="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              Announcing our Products{" "}
              <a 
              href="https://resellersprint.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="font-semibold text-orange-600">
                <span class="absolute inset-0" aria-hidden="true"></span>Read
                more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          <div class="text-center">
            <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Download productlist for {categoryname}
            </h1>
            <div class="mt-10 flex items-center justify-center gap-x-6">
              {loading ? (
                <>
                  <a
                    
                    href="#"
                    class="rounded-md bg-orange-300 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Please wait...
                  </a>
                </>
              ) : (
                <>
                  <a
                    onClick={print}
                    href="#"
                    class="rounded-md bg-orange-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Download PDF
                  </a>
                </>
              )}
              
            </div>
          </div>
        </div>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.8.335/build/pdf.worker.min.js">
          <div
            style={{
              alignItems: "center",
              backgroundColor: "#eeeeee",
              borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
              display: "flex",
              justifyContent: "center",
              padding: "4px",
            }}
          >
            <ZoomOutButton />
            <ZoomPopover />
            <ZoomInButton />
          </div>
          {/* <Viewer fileUrl={url} plugins={[zoomPluginInstance]} /> */}
        </Worker>
      </div>
    </div>
  );
};

// render(<HomePage />, document.getElementById("root"));
export default CategoryList;
