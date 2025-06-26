import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import OverviewTab from "../../components/admin/OverviewTab";
import ProductsTab from "../../components/admin/ProductsTab";
import ArtisansTab from "../../components/admin/ArtisansTab";
import VerificationModal from "../../components/admin/VerificationModal";
import CategoryTab from "../../components/admin/CategoryTab";
import ConfirmationModal from "../../components/admin/ConfirmationModal";
import EditProductModal from "../../components/admin/EditProductModal";

const AdminDashboard = () => {
  const { products, currency, axios, BACKEND_URL, navigate, setIsAdmin, fetchProducts } =
    useAppContext();
  const [activeTab, setActiveTab] = useState("overview");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(""); // 'product' or 'artisan'
  const [artisans, setArtisans] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [users, setUsers] = useState(0);

  // Fetch artisans when component mounts
  const fetchArtisans = async () => {
    try {
      const { data } = await axios.get(`/api/admin/artisans`, {
        withCredentials: true,
      });

      console.log("Artisans fetched successfully", data.artisans);
      if (data.success) {
        setArtisans(data.artisans);
      } else {
        toast.error("Failed to fetch artisans");
      }
    } catch (error) {
      toast.error("Failed to fetch artisans");
    }
  };

  //fetch users
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`/api/admin/users`, {
        withCredentials: true,
      });

      if (data.success) {
        setUsers(data.users.length);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  // Fetch categories and subcategories
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`/api/admin/categories`, {
        withCredentials: true,
      });

      if (data.success) {
        setCategories(data.categories);
      } else {
        toast.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    }
  };

  const fetchSubcategories = async () => {
    try {
      const { data } = await axios.get(`/api/admin/subcategories`, {
        withCredentials: true,
      });

      if (data.success) {
        setSubcategories(data.subcategories);
      } else {
        toast.error("Failed to fetch subcategories");
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast.error("Failed to fetch subcategories");
    }
  };

  useEffect(() => {
    fetchArtisans();
    fetchUsers();
    fetchCategories();
    fetchSubcategories();
  }, []);

  // Category and subcategory management functions
  const handleAddCategory = async (categoryData) => {
    try {
      const formData = new FormData();
      formData.append("title", categoryData.title);
      formData.append("path", categoryData.path);
      if (categoryData.image) {
        formData.append("image", categoryData.image);
      }
      formData.append("tagline", categoryData.tagline);

      console.log(formData);

      const { data } = await axios.post(`/api/admin/categories/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      console.log(data);
      if (data.success) {
        toast.success("Category added successfully");
        fetchCategories(); // Refresh categories list
      } else {
        toast.error(data.message || "Failed to add category");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error(error.response?.data?.message || "Failed to add category");
    }
  };

  const handleAddSubcategory = async (subcategoryData) => {
    try {
      const formData = new FormData();
      formData.append("title", subcategoryData.title);
      formData.append("path", subcategoryData.path);
      formData.append("category", subcategoryData.category);
      if (subcategoryData.image) {
        formData.append("image", subcategoryData.image);
      }

      const { data } = await axios.post(
        `/api/admin/subcategories/add`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success("Subcategory added successfully");
        fetchSubcategories(); // Refresh subcategories list
      } else {
        toast.error(data.message || "Failed to add subcategory");
      }
    } catch (error) {
      console.error("Error adding subcategory:", error);
      toast.error(error.response?.data?.message || "Failed to add subcategory");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this category? This will also delete all associated subcategories."
      )
    ) {
      try {
        const { data } = await axios.delete(
          `/api/admin/categories/${categoryId}`,
          {
            withCredentials: true,
          }
        );

        if (data.success) {
          toast.success("Category deleted successfully");
          fetchCategories(); // Refresh categories list
          fetchSubcategories(); // Refresh subcategories list as some might be deleted
        } else {
          toast.error(data.message || "Failed to delete category");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        toast.error(
          error.response?.data?.message || "Failed to delete category"
        );
      }
    }
  };

  const handleDeleteSubcategory = async (subcategoryId) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      try {
        const { data } = await axios.delete(
          `/api/admin/subcategories/${subcategoryId}`,
          {
            withCredentials: true,
          }
        );

        if (data.success) {
          toast.success("Subcategory deleted successfully");
          fetchSubcategories(); // Refresh subcategories list
        } else {
          toast.error(data.message || "Failed to delete subcategory");
        }
      } catch (error) {
        console.error("Error deleting subcategory:", error);
        toast.error(
          error.response?.data?.message || "Failed to delete subcategory"
        );
      }
    }
  };

  const pendingProducts = products.filter((product) => product.status === "pending");

  // Filter artisans by status
  const pendingArtisans = artisans.filter(
    (artisan) => !artisan.isVerified && !artisan.isRejected
  ) || [
    {
      id: "A001",
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      phone: "+91 98765 43210",
      joinDate: "2023-10-15",
      status: "pending",
    },
    {
      id: "A002",
      name: "Priya Sharma",
      email: "priya@example.com",
      phone: "+91 87654 32109",
      joinDate: "2023-10-16",
      status: "pending",
    },
    {
      id: "A003",
      name: "Amit Patel",
      email: "amit@example.com",
      phone: "+91 76543 21098",
      joinDate: "2023-10-17",
      status: "pending",
    },
  ];

  const approvedArtisans = artisans.filter((artisan) => artisan.isVerified) || [
    {
      id: "A004",
      name: "Meera Joshi",
      email: "meera@example.com",
      phone: "+91 98765 12345",
      joinDate: "2023-10-10",
      status: "approved",
    },
    {
      id: "A005",
      name: "Vikram Singh",
      email: "vikram@example.com",
      phone: "+91 87654 23456",
      joinDate: "2023-10-11",
      status: "approved",
    },
    {
      id: "A006",
      name: "Ananya Desai",
      email: "ananya@example.com",
      phone: "+91 76543 34567",
      joinDate: "2023-10-12",
      status: "approved",
    },
  ];

  // New rejected artisans array
  const rejectedArtisans = artisans.filter((artisan) => artisan.isRejected) || [
    {
      id: "A007",
      name: "Rahul Verma",
      email: "rahul@example.com",
      phone: "+91 98765 56789",
      joinDate: "2023-10-13",
      status: "rejected",
    },
    {
      id: "A008",
      name: "Neha Gupta",
      email: "neha@example.com",
      phone: "+91 87654 67890",
      joinDate: "2023-10-14",
      status: "rejected",
    },
  ];

  const openVerifyModal = (item, type) => {
    setSelectedItem(item);
    setModalType(type);
    setShowVerifyModal(true);
  };

  const handleVerify = async (approved) => {
    try {
      const status = approved? "approved" : "rejected";
      if (modalType === "product") {
        const { data } = await axios.put(
          `/api/admin/products/verify/${approved.id}`,
          { status, notes: approved.notes },
          { withCredentials: true }
        );
        console.log(data);
        if (data.success) {
          fetchProducts();
          const message = approved
            ? `${
                modalType === "product" ? "Product" : "Artisan"
              } approved successfully!`
            : `${modalType === "product" ? "Product" : "Artisan"} rejected.`;

          toast.success(message);
          setShowVerifyModal(false);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.put(
          `/api/admin/verify`,
          {
            artisanId: approved.id,
            isVerified: approved.status,
            comments: approved.notes,
          },
          { withCredentials: true }
        );
        if (data.success) {
          fetchArtisans();
          const message = approved
            ? `${
                modalType === "product" ? "Product" : "Artisan"
              } approved successfully!`
            : `${modalType === "product" ? "Product" : "Artisan"} rejected.`;

          toast.success(message);
          setShowVerifyModal(false);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error(error.response?.data?.message || "Verification failed");
    }
  };

  const handleLogout = async () => {
    try {
      const { data } = await axios.post(
        `/api/admin/logout`,
        {},
        { withCredentials: true }
      );

      if (data.success) {
        setIsAdmin(false);
        toast.success("Logged out successfully");
        navigate("/admin");
      } else {
        toast.error(data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setShowEditModal(true);
  };

  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDeleteProduct = async () => {
    try {
      const { data } = await axios.delete(`/api/admin/products/delete/${productToDelete._id}`, {
        withCredentials: true,
      });
      
      if (data.success) {
        toast.success("Product deleted successfully");
        fetchProducts(); // Refresh products list
        setShowDeleteModal(false);
        setProductToDelete(null);
      } else {
        toast.error(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  const handleSaveProduct = async (editedData) => {
    try {
      const { data } = await axios.put(
        `/api/admin/products/edit/${productToEdit._id}`, 
        {
          inStock: editedData.inStock,
          quantity: parseInt(editedData.quantity)
        },
        {
          withCredentials: true,
        }
      );
      
      if (data.success) {
        toast.success("Product updated successfully");
        fetchProducts(); // Refresh products list
        setShowEditModal(false);
        setProductToEdit(null);
      } else {
        toast.error(data.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.response?.data?.message || "Failed to update product");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            pendingProducts={pendingProducts}
            pendingArtisans={pendingArtisans}
            totalUsers={users}
          />
        );
      case "pendingProducts":
        return (
          <ProductsTab
            pendingProducts={products.filter(product => product.status === "pending")}
            artisans={artisans}
            onVerify={(product) => openVerifyModal(product, "product")}
            title="Products Pending Approval"
            status="pending"
          />
        );
      case "approvedProducts":
        return (
          <ProductsTab
            pendingProducts={products.filter(product => product.status === "approved")}
            artisans={artisans}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            title="Approved Products"
            status="approved"
          />
        );
      case "rejectedProducts":
        return (
          <ProductsTab
            pendingProducts={products.filter(product => product.status === "rejected")}
            artisans = {artisans}
            onVerify={(product) => openVerifyModal(product, "product")}
            title="Rejected Products"
            status="rejected"
          />
        );
      case "pendingArtisans":
        return (
          <ArtisansTab
            artisans={pendingArtisans}
            onVerify={(artisan) => openVerifyModal(artisan, "artisan")}
            title="Artisans Pending Approval"
          />
        );
      case "approvedArtisans":
        return (
          <ArtisansTab
            artisans={approvedArtisans}
            showActions={false}
            title="Approved Artisans"
          />
        );
      case "rejectedArtisans":
        return (
          <ArtisansTab
            artisans={rejectedArtisans}
            showActions={false}
            title="Rejected Artisans"
          />
        );
      case "categories":
        return (
          <CategoryTab
            categories={categories}
            subcategories={subcategories}
            onAddCategory={handleAddCategory}
            onAddSubcategory={handleAddSubcategory}
            onDeleteCategory={handleDeleteCategory}
            onDeleteSubcategory={handleDeleteSubcategory}
          />
        );
      default:
        return (
          <OverviewTab
            pendingProducts={pendingProducts}
            pendingArtisans={pendingArtisans}
            totalUsers={users}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-900">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto mb-6 bg-white rounded-lg p-1 shadow-sm">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "overview"
              ? "bg-amber-900 text-white"
              : "text-gray-700 hover:bg-amber-100"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("pendingProducts")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "pendingProducts"
              ? "bg-amber-900 text-white"
              : "text-gray-700 hover:bg-amber-100"
          }`}
        >
          Pending Products
        </button>
        <button
          onClick={() => setActiveTab("approvedProducts")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "approvedProducts"
              ? "bg-amber-900 text-white"
              : "text-gray-700 hover:bg-amber-100"
          }`}
        >
          Approved Products
        </button>
        <button
          onClick={() => setActiveTab("rejectedProducts")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "rejectedProducts"
              ? "bg-amber-900 text-white"
              : "text-gray-700 hover:bg-amber-100"
          }`}
        >
          Rejected Products
        </button>
        <button
          onClick={() => setActiveTab("pendingArtisans")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "pendingArtisans"
              ? "bg-amber-900 text-white"
              : "text-gray-700 hover:bg-amber-100"
          }`}
        >
          Pending Artisans
        </button>
        <button
          onClick={() => setActiveTab("approvedArtisans")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "approvedArtisans"
              ? "bg-amber-900 text-white"
              : "text-gray-700 hover:bg-amber-100"
          }`}
        >
          Approved Artisans
        </button>

        <button
          onClick={() => setActiveTab("categories")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "categories"
              ? "bg-amber-900 text-white"
              : "text-gray-700 hover:bg-amber-100"
          }`}
        >
          Categories
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        {renderTabContent()}
      </div>

      {/* Verification Modal */}
      {showVerifyModal && selectedItem && (
        <VerificationModal
          item={selectedItem}
          type={modalType}
          onClose={() => setShowVerifyModal(false)}
          onVerify={handleVerify}
        />
      )}

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveProduct}
        product={productToEdit}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && productToDelete && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDeleteProduct}
          title="Delete Product"
          message={`Are you sure you want to delete "${productToDelete.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default AdminDashboard;