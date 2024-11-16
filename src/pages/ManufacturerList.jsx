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


const ManufacturerList = () => {
  const { manid } = useParams();
  const [json, setJson] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suppliername,setSuppliername] = useState("");

  
  useEffect(() => {
    getData();
    getUserdata();
  }, []);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://res-server-sigma.vercel.app/api/product/productlist/${manid}`
      );
      const apiData = response.data;
      setJson(apiData);
      console.log("Supplier products", apiData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const getUserdata = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://res-server-sigma.vercel.app/api/shop/usersdata/${manid}`
      );
      const userdata = response.data;
      console.log("User data:", userdata);
      setLoading(false);
      setSuppliername(userdata?.user?.companyName || "Unknown Supplier");
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("An error occurred while fetching supplier data.");
      setLoading(false);
    }
  };

  const print = () => {
    if (!json || json.length === 0) {
      console.error("No data available for PDF generation.");
      return;
    }

    const pdf = new jsPDF("p", "pt", "a4");
    const columns = [
      "Product Name",
      "SKU",
      "Category",
      "Price ($)",
      "Warranty (Months)",
      "Status",
    ];

    // Map API data to rows for PDF table
    const rows = json.map((item) => [
      item.name || "N/A",
      item.sku || "N/A",
      item.category || "N/A",
      item.price || "N/A",
      item.warranty || "N/A",
      item.status || "N/A",
    ]);

    // Add a title to the PDF
    pdf.text(235, 40, `ResellerSprint - ${suppliername} Product List`);
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

    pdf.save(`${suppliername}_ProductList.pdf`);
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
            <a href="#" class="-m-1.5 p-1.5">
              <span class="text-slate-3xl">ResellerSprint</span>
              
            </a>
          </div>
          
          <div class="hidden lg:flex lg:gap-x-12">
            
            <a href="#" class="text-sm font-semibold leading-6 text-gray-900">
              Company
            </a>
          </div>
          <div class="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="#" class="text-sm font-semibold leading-6 text-gray-900">
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
          <div
            class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            
          ></div>
        </div>
        <div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div class="hidden sm:mb-8 sm:flex sm:justify-center">
            <div class="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              Announcing our Products{" "}
              <a href="resellersprint.com" class="font-semibold text-orange-600">
                <span class="absolute inset-0" aria-hidden="true"></span>Read
                more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          <div class="text-center">
            {
              !loading ? (<>
              <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Download productlist for {suppliername}
            </h1>
              </>):(<>
                <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Getting Info....
            </h1></>)
            }
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
export default ManufacturerList;
