import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Plus, Edit2, Trash2, Upload, X } from 'lucide-react';
import Toast from '../components/Toast';

function AdminPanel() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (password === process.env.REACT_APP_ADMIN_PASSWORD || password === 'Admin@Akagera2024!') {
      setIsAuthenticated(true);
      setError('');
      localStorage.setItem('admin_authenticated', 'true');
    } else {
      setError('Invalid admin password');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    localStorage.removeItem('admin_authenticated');
    navigate('/');
  };

  React.useEffect(() => {
    if (localStorage.getItem('admin_authenticated') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0B3C5D 0%, #1a5a7f 100%)'
      }}>
        <div style={{
          background: 'white',
          padding: '50px',
          borderRadius: '12px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
          maxWidth: '400px',
          width: '100%'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <Lock size={48} style={{ color: '#0B3C5D', marginBottom: '15px' }} />
            <h1 style={{ color: '#0B3C5D', marginBottom: '10px' }}>Admin Access</h1>
            <p style={{ color: '#666' }}>Enter the admin password to continue</p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px', position: 'relative' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 'bold',
                color: '#333'
              }}>
                Admin Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  style={{
                    width: '100%',
                    padding: '12px',
                    paddingRight: '40px',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#0B3C5D'}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#666'
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                background: '#fee',
                color: '#c33',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                borderLeft: '4px solid #c33'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                background: '#0B3C5D',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}
            >
              Access Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <AdminDashboard onLogout={handleLogout} />;
}

function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    total_users: 0,
    total_apps: 0,
    total_services: 0,
    total_payments: 0,
    total_revenue: 0
  });
  const [users, setUsers] = useState([]);
  const [apps, setApps] = useState([]);
  const [services, setServices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toast state
  const [toast, setToast] = useState({ message: '', type: 'success', show: false });

  // Form states
  const [showAppForm, setShowAppForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [editingService, setEditingService] = useState(null);

  // Form data
  const [appFormData, setAppFormData] = useState({
    name: '',
    description: '',
    short_description: '',
    features: '',
    how_it_works: '',
    installation_steps: '',
    requires_license: false,
    download_url: '',
    app_icon: null,
    app_logo: null,
    app_image: null,
    app_icon_preview: '',
    app_logo_preview: '',
    app_image_preview: ''
  });

  const [serviceFormData, setServiceFormData] = useState({
    name: '',
    description: '',
    price: '',
    icon: '',
    service_image: null,
    service_image_preview: ''
  });

  const adminPassword = 'Admin@Akagera2024!';

  const showToast = (message, type = 'success') => {
    setToast({ message, type, show: true });
    setTimeout(() => setToast({ ...toast, show: false }), 3500);
  };

  React.useEffect(() => {
    fetchDashboardStats();
  }, []);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://akagerainc.onrender.com/api';
  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin-xyz789-control/stats?password=${adminPassword}`
      );
      const data = await response.json();
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/admin-xyz789-control/users?password=${adminPassword}`
      );
      const data = await response.json();
      setUsers(data.users || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setLoading(false);
    }
  };

  const fetchApps = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/admin-xyz789-control/apps?password=${adminPassword}`
      );
      const data = await response.json();
      setApps(data.apps || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching apps:', error);
      setApps([]);
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/admin-xyz789-control/services?password=${adminPassword}`
      );
      const data = await response.json();
      setServices(data.services || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/admin-xyz789-control/payments?password=${adminPassword}`
      );
      const data = await response.json();
      setPayments(data.payments || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
      setLoading(false);
    }
  };

  const fetchLicenses = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/admin-xyz789-control/licenses?password=${adminPassword}`
      );
      const data = await response.json();
      setLicenses(data.licenses || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching licenses:', error);
      setLicenses([]);
      setLoading(false);
    }
  };

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/admin-xyz789-control/images?password=${adminPassword}`
      );
      const data = await response.json();
      
      // Fetch base64 data for each image
      const imagesWithData = await Promise.all((data.images || []).map(async (img) => {
        try {
          const dataResponse = await fetch(
            `${API_BASE_URL}/admin-xyz789-control/images/${img.id}/data?password=${adminPassword}`
          );
          const imageData = await dataResponse.json();
          return { ...img, imageData: imageData.data };
        } catch (e) {
          console.error(`Error fetching image ${img.id} data:`, e);
          return img;
        }
      }));
      
      setImages(imagesWithData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching images:', error);
      setImages([]);
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    if (tab === 'users') fetchUsers();
    else if (tab === 'apps') fetchApps();
    else if (tab === 'services') fetchServices();
    else if (tab === 'payments') fetchPayments();
    else if (tab === 'licenses') fetchLicenses();
    else if (tab === 'images') fetchImages();
  };

  const handleSaveApp = async () => {
    try {
      const url = editingApp 
        ? `${API_BASE_URL}/admin-xyz789-control/apps/${editingApp.id}?password=${adminPassword}`
        : `${API_BASE_URL}/admin-xyz789-control/apps?password=${adminPassword}`;
      
      const method = editingApp ? 'PUT' : 'POST';
      
      const formData = new FormData();
      formData.append('password', adminPassword);
      formData.append('name', appFormData.name);
      formData.append('description', appFormData.description);
      formData.append('short_description', appFormData.short_description);
      formData.append('features', appFormData.features);
      formData.append('how_it_works', appFormData.how_it_works);
      formData.append('installation_steps', appFormData.installation_steps);
      formData.append('requires_license', appFormData.requires_license);
      formData.append('download_url', appFormData.download_url);
      
      // Add file fields if they exist
      if (appFormData.app_icon instanceof File) {
        formData.append('app_icon', appFormData.app_icon);
      }
      if (appFormData.app_logo instanceof File) {
        formData.append('app_logo', appFormData.app_logo);
      }
      if (appFormData.app_image instanceof File) {
        formData.append('app_image', appFormData.app_image);
      }
      
      const response = await fetch(url, {
        method,
        body: formData
      });
      
      if (response.ok) {
        setShowAppForm(false);
        setEditingApp(null);
        setAppFormData({
          name: '',
          description: '',
          short_description: '',
          features: '',
          how_it_works: '',
          installation_steps: '',
          requires_license: false,
          download_url: '',
          app_icon: null,
          app_logo: null,
          app_image: null,
          app_icon_preview: '',
          app_logo_preview: '',
          app_image_preview: ''
        });
        fetchApps();
        showToast('✅ App saved successfully!', 'success');
      } else {
        const error = await response.json();
        const errorMsg = error.detail || 'Unknown error occurred';
        console.error('Response error:', error);
        showToast(`❌ Error saving app: ${errorMsg}`, 'error');
      }
    } catch (error) {
      console.error('Error saving app:', error);
      showToast(`❌ Error: ${error.message}`, 'error');
    }
  };

  const handleSaveService = async () => {
    try {
      const url = editingService
        ? `${API_BASE_URL}/admin-xyz789-control/services/${editingService.id}?password=${adminPassword}`
        : `${API_BASE_URL}/admin-xyz789-control/services?password=${adminPassword}`;
      
      const method = editingService ? 'PUT' : 'POST';
      
      const formData = new FormData();
      formData.append('password', adminPassword);
      formData.append('name', serviceFormData.name);
      formData.append('description', serviceFormData.description);
      formData.append('price', serviceFormData.price);
      formData.append('icon', serviceFormData.icon);
      
      if (serviceFormData.service_image instanceof File) {
        formData.append('service_image', serviceFormData.service_image);
      }
      
      const response = await fetch(url, {
        method,
        body: formData
      });
      
      if (response.ok) {
        setShowServiceForm(false);
        setEditingService(null);
        setServiceFormData({
          name: '',
          description: '',
          price: '',
          icon: '',
          service_image: null,
          service_image_preview: ''
        });
        fetchServices();
        showToast('✅ Service saved successfully!', 'success');
      } else {
        const error = await response.json();
        const errorMsg = error.detail || 'Unknown error occurred';
        console.error('Response error:', error);
        showToast(`❌ Error saving service: ${errorMsg}`, 'error');
      }
    } catch (error) {
      console.error('Error saving service:', error);
      showToast(`❌ Error: ${error.message}`, 'error');
    }
  };

  const handleImageUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('alt_text', file.name.split('.')[0]);
      formData.append('page_type', 'home');
      
      console.log('Uploading image:', file.name);
      
      const response = await fetch(
        `${API_BASE_URL}/admin-xyz789-control/images?password=${adminPassword}`,
        {
          method: 'POST',
          body: formData
        }
      );
      
      const responseData = await response.json();
      console.log('Upload response:', responseData, 'Status:', response.status);
      
      if (response.ok) {
        showToast('✅ Image uploaded successfully!', 'success');
        await fetchImages();
        setShowImageUpload(false);
      } else {
        const errorMsg = responseData.detail || 'Unknown error';
        showToast(`❌ Upload failed: ${errorMsg}`, 'error');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showToast(`❌ Error: ${error.message}`, 'error');
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Delete this user?')) {
      try {
        await fetch(
          `https://akagerainc.onrender.com/api/admin-xyz789-control/users/${userId}?password=${adminPassword}`,
          { method: 'DELETE' }
        );
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const deleteApp = async (appId) => {
    if (window.confirm('Delete this app?')) {
      try {
        await fetch(
          `https://akagerainc.onrender.com/api/admin-xyz789-control/apps/${appId}?password=${adminPassword}`,
          { method: 'DELETE' }
        );
        fetchApps();
      } catch (error) {
        console.error('Error deleting app:', error);
      }
    }
  };

  const deleteService = async (serviceId) => {
    if (window.confirm('Delete this service?')) {
      try {
        await fetch(
          `${API_BASE_URL}/admin-xyz789-control/services/${serviceId}?password=${adminPassword}`,
          { method: 'DELETE' }
        );
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const deleteImage = async (imageId) => {
    if (window.confirm('Delete this image?')) {
      try {
        await fetch(
          `${API_BASE_URL}/admin-xyz789-control/images/${imageId}?password=${adminPassword}`,
          { method: 'DELETE' }
        );
        fetchImages();
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', paddingTop: '80px' }}>
      {/* Toast Notification */}
      {toast.show && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          zIndex: 9999,
          animation: 'slideInRight 0.3s ease'
        }}>
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast({ ...toast, show: false })}
          />
        </div>
      )}
      
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          background: 'white',
          padding: '20px',
          borderRadius: '12px'
        }}>
          <div>
            <h1 style={{ color: '#0B3C5D', marginBottom: '5px' }}>🔐 Admin Dashboard</h1>
            <p style={{ color: '#666' }}>Complete database management and control</p>
          </div>
          <button
            onClick={onLogout}
            style={{
              padding: '10px 20px',
              background: '#dc143c',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
          overflowX: 'auto',
          paddingBottom: '10px'
        }}>
          {['dashboard', 'users', 'apps', 'services', 'payments', 'licenses', 'images'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              style={{
                padding: '10px 20px',
                background: activeTab === tab ? '#0B3C5D' : 'white',
                color: activeTab === tab ? 'white' : '#333',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ background: 'white', padding: '30px', borderRadius: '12px' }}>
          {loading && <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>}

          {!loading && activeTab === 'dashboard' && (
            <div>
              <h2 style={{ marginBottom: '20px' }}>Dashboard Statistics</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px'
              }}>
                <StatCard title="Total Users" value={stats?.total_users || 0} color="#0B3C5D" />
                <StatCard title="Total Apps" value={stats?.total_apps || 0} color="#06D6A0" />
                <StatCard title="Total Services" value={stats?.total_services || 0} color="#F77F00" />
                <StatCard title="Total Payments" value={stats?.total_payments || 0} color="#D62828" />
                <StatCard title="Total Revenue" value={`$${(stats?.total_revenue || 0).toFixed(2)}`} color="#1a5a7f" />
              </div>
            </div>
          )}

          {!loading && activeTab === 'users' && (
            <div>
              <h2 style={{ marginBottom: '20px' }}>Users Management</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
                      <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Created</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(users || []).map((user) => (
                      <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px' }}>{user.id}</td>
                        <td style={{ padding: '12px' }}>{user.name}</td>
                        <td style={{ padding: '12px' }}>{user.email}</td>
                        <td style={{ padding: '12px' }}>{new Date(user.created_at).toLocaleDateString()}</td>
                        <td style={{ padding: '12px' }}>
                          <button
                            onClick={() => deleteUser(user.id)}
                            style={{
                              padding: '6px 12px',
                              background: '#dc143c',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!loading && activeTab === 'apps' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Apps Management</h2>
                <button
                  onClick={() => {
                    setEditingApp(null);
                    setAppFormData({
                      name: '',
                      description: '',
                      short_description: '',
                      features: '',
                      how_it_works: '',
                      installation_steps: '',
                      requires_license: false,
                      download_url: '',
                      app_icon: null,
                      app_logo: null,
                      app_image: null,
                      app_icon_preview: '',
                      app_logo_preview: '',
                      app_image_preview: ''
                    });
                    setShowAppForm(!showAppForm);
                  }}
                  style={{
                    padding: '10px 20px',
                    background: '#06D6A0',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={20} /> New App
                </button>
              </div>

              {showAppForm && <AppForm
                data={appFormData}
                onDataChange={setAppFormData}
                onSave={handleSaveApp}
                onCancel={() => {
                  setShowAppForm(false);
                  setEditingApp(null);
                }}
                isEditing={!!editingApp}
              />}

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
                      <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>License</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Created</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(apps || []).map((app) => (
                      <tr key={app.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px' }}>{app.id}</td>
                        <td style={{ padding: '12px' }}>{app.name}</td>
                        <td style={{ padding: '12px' }}>{app.requires_license ? 'Yes' : 'No'}</td>
                        <td style={{ padding: '12px' }}>{new Date(app.created_at).toLocaleDateString()}</td>
                        <td style={{ padding: '12px', display: 'flex', gap: '10px' }}>
                          <button
                            onClick={() => {
                              setEditingApp(app);
                              setAppFormData({
                                name: app.name,
                                description: app.description,
                                short_description: app.short_description,
                                features: app.features || '',
                                how_it_works: app.how_it_works || '',
                                installation_steps: app.installation_steps || '',
                                requires_license: app.requires_license,
                                download_url: app.download_url || '',
                                app_icon: app.app_icon || null,
                                app_logo: app.app_logo || null,
                                app_image: app.app_image || null,
                                app_icon_preview: app.app_icon || '',
                                app_logo_preview: app.app_logo || '',
                                app_image_preview: app.app_image || ''
                              });
                              setShowAppForm(true);
                            }}
                            style={{
                              padding: '6px 12px',
                              background: '#F77F00',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteApp(app.id)}
                            style={{
                              padding: '6px 12px',
                              background: '#dc143c',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!loading && activeTab === 'services' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Services Management</h2>
                <button
                  onClick={() => {
                    setEditingService(null);
                    setServiceFormData({
                      name: '',
                      description: '',
                      price: '',
                      icon: ''
                    });
                    setShowServiceForm(!showServiceForm);
                  }}
                  style={{
                    padding: '10px 20px',
                    background: '#06D6A0',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={20} /> New Service
                </button>
              </div>

              {showServiceForm && <ServiceForm
                data={serviceFormData}
                onDataChange={setServiceFormData}
                onSave={handleSaveService}
                onCancel={() => {
                  setShowServiceForm(false);
                  setEditingService(null);
                }}
                isEditing={!!editingService}
              />}

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
                      <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Price</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Created</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(services || []).map((service) => (
                      <tr key={service.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px' }}>{service.id}</td>
                        <td style={{ padding: '12px' }}>{service.name}</td>
                        <td style={{ padding: '12px' }}>${service.price}</td>
                        <td style={{ padding: '12px' }}>{new Date(service.created_at).toLocaleDateString()}</td>
                        <td style={{ padding: '12px', display: 'flex', gap: '10px' }}>
                          <button
                            onClick={() => {
                              setEditingService(service);
                              setServiceFormData({
                                name: service.name,
                                description: service.description,
                                price: service.price,
                                icon: service.icon || ''
                              });
                              setShowServiceForm(true);
                            }}
                            style={{
                              padding: '6px 12px',
                              background: '#F77F00',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteService(service.id)}
                            style={{
                              padding: '6px 12px',
                              background: '#dc143c',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!loading && activeTab === 'payments' && (
            <div>
              <h2 style={{ marginBottom: '20px' }}>Payments Management</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
                      <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>User ID</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Amount</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(payments || []).map((payment) => (
                      <tr key={payment.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px' }}>{payment.id}</td>
                        <td style={{ padding: '12px' }}>{payment.user_id}</td>
                        <td style={{ padding: '12px' }}>${payment.amount}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            padding: '4px 12px',
                            background: payment.status === 'completed' ? '#06D6A0' : '#F77F00',
                            color: 'white',
                            borderRadius: '4px'
                          }}>
                            {payment.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>{new Date(payment.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!loading && activeTab === 'licenses' && (
            <div>
              <h2 style={{ marginBottom: '20px' }}>Licenses Management</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
                      <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>User ID</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>App ID</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Key</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(licenses || []).map((license) => (
                      <tr key={license.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px' }}>{license.id}</td>
                        <td style={{ padding: '12px' }}>{license.user_id}</td>
                        <td style={{ padding: '12px' }}>{license.app_id}</td>
                        <td style={{ padding: '12px', fontSize: '12px', fontFamily: 'monospace' }}>
                          {license.license_key.substring(0, 10)}...
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            padding: '4px 12px',
                            background: license.is_active ? '#06D6A0' : '#dc143c',
                            color: 'white',
                            borderRadius: '4px'
                          }}>
                            {license.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!loading && activeTab === 'images' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Carousel Images</h2>
                <button
                  onClick={() => setShowImageUpload(!showImageUpload)}
                  style={{
                    padding: '10px 20px',
                    background: '#06D6A0',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <Upload size={20} /> Upload Image
                </button>
              </div>

              {showImageUpload && <ImageUploadForm onUpload={handleImageUpload} onCancel={() => setShowImageUpload(false)} />}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {(images || []).map((image) => (
                  <div key={image.id} style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{
                      width: '100%',
                      height: '150px',
                      background: '#f0f0f0',
                      overflow: 'hidden'
                    }}>
                      <img src={image.imageData || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="150"%3E%3Crect fill="%23ccc" width="200" height="150"/%3E%3C/svg%3E'} alt={image.alt_text} style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }} />
                    </div>
                    <div style={{ padding: '12px' }}>
                      <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#333', fontWeight: 'bold' }}>{image.filename}</p>
                      <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#666' }}>{image.alt_text}</p>
                      <p style={{ margin: '0 0 8px 0', fontSize: '10px', color: '#999' }}>{image.size} bytes</p>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => deleteImage(image.id)}
                          style={{
                            flex: 1,
                            padding: '8px',
                            background: '#dc143c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
      color: 'white',
      padding: '25px',
      borderRadius: '12px',
      textAlign: 'center',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
    }}>
      <p style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.9 }}>{title}</p>
      <h2 style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{value}</h2>
    </div>
  );
}

function AppForm({ data, onDataChange, onSave, onCancel, isEditing }) {
  const handleFileChange = (fieldName, e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        onDataChange({
          ...data,
          [fieldName]: file,
          [fieldName + '_preview']: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{
      background: '#f9f9f9',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '2px solid #06D6A0'
    }}>
      <h3>{isEditing ? 'Edit App' : 'Add New App'}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
        <input type="text" placeholder="App Name" value={data.name} onChange={(e) => onDataChange({...data, name: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
        <input type="text" placeholder="Short Description" value={data.short_description} onChange={(e) => onDataChange({...data, short_description: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
        <textarea placeholder="Description" value={data.description} onChange={(e) => onDataChange({...data, description: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', gridColumn: '1 / -1' }} />
        <textarea placeholder="Features (comma-separated, e.g: Login, Dashboard, AI Support)" value={data.features} onChange={(e) => onDataChange({...data, features: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', gridColumn: '1 / -1' }} />
        <textarea placeholder="How it Works" value={data.how_it_works} onChange={(e) => onDataChange({...data, how_it_works: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', gridColumn: '1 / -1' }} />
        <textarea placeholder="Installation Steps (comma-separated, e.g: Download APK, Install App, Open App)" value={data.installation_steps} onChange={(e) => onDataChange({...data, installation_steps: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', gridColumn: '1 / -1' }} />
        <input type="text" placeholder="Download URL" value={data.download_url} onChange={(e) => onDataChange({...data, download_url: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input type="checkbox" checked={data.requires_license} onChange={(e) => onDataChange({...data, requires_license: e.target.checked})} />
          Requires License
        </label>

        {/* File Upload Fields */}
        <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginTop: '10px', paddingTop: '15px', borderTop: '1px solid #ddd' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>App Icon</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => handleFileChange('app_icon', e)} 
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', boxSizing: 'border-box' }} 
            />
            {data.app_icon_preview && (
              <div style={{ marginTop: '8px', width: '60px', height: '60px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #ddd' }}>
                <img src={data.app_icon_preview} alt="Icon preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>App Logo</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => handleFileChange('app_logo', e)} 
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', boxSizing: 'border-box' }} 
            />
            {data.app_logo_preview && (
              <div style={{ marginTop: '8px', width: '60px', height: '60px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #ddd' }}>
                <img src={data.app_logo_preview} alt="Logo preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>App Image</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => handleFileChange('app_image', e)} 
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', boxSizing: 'border-box' }} 
            />
            {data.app_image_preview && (
              <div style={{ marginTop: '8px', width: '60px', height: '60px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #ddd' }}>
                <img src={data.app_image_preview} alt="Image preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={onSave} style={{ padding: '10px 20px', background: '#06D6A0', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
        <button onClick={onCancel} style={{ padding: '10px 20px', background: '#ddd', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
      </div>
    </div>
  );
}

function ServiceForm({ data, onDataChange, onSave, onCancel, isEditing }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onDataChange({
          ...data,
          service_image: file,
          service_image_preview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{
      background: '#f9f9f9',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '2px solid #F77F00'
    }}>
      <h3>{isEditing ? 'Edit Service' : 'Add New Service'}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
        <input type="text" placeholder="Service Name" value={data.name} onChange={(e) => onDataChange({...data, name: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
        <input type="number" placeholder="Price" value={data.price} onChange={(e) => onDataChange({...data, price: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
        <textarea placeholder="Description" value={data.description} onChange={(e) => onDataChange({...data, description: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', gridColumn: '1 / -1' }} />
        <input type="text" placeholder="Icon Name" value={data.icon} onChange={(e) => onDataChange({...data, icon: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
        
        {/* Service Image Upload */}
        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '15px', alignItems: 'flex-start', marginTop: '10px', paddingTop: '15px', borderTop: '1px solid #ddd' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Service Image</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', boxSizing: 'border-box' }} 
            />
          </div>
          {data.service_image_preview && (
            <div style={{ width: '80px', height: '80px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #ddd' }}>
              <img src={data.service_image_preview} alt="Service preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={onSave} style={{ padding: '10px 20px', background: '#F77F00', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
        <button onClick={onCancel} style={{ padding: '10px 20px', background: '#ddd', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
      </div>
    </div>
  );
}

function ImageUploadForm({ onUpload, onCancel }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    // Show image preview
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  
  const handleUpload = async () => {
    if (file) {
      setLoading(true);
      try {
        await onUpload(file);
        setFile(null);
        setPreview(null);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{
      background: '#f9f9f9',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '2px dashed #06D6A0'
    }}>
      <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            disabled={loading}
            style={{ 
              flex: 1, 
              padding: '10px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              width: '100%'
            }} 
          />
          <p style={{ fontSize: '12px', color: '#666', margin: '8px 0 0 0' }}>
            {file ? `Selected: ${file.name}` : 'Select an image file'}
          </p>
        </div>
        
        {preview && (
          <div style={{ width: '100px', height: '100px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #ddd' }}>
            <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={handleUpload} 
            disabled={!file || loading} 
            style={{ 
              padding: '10px 20px', 
              background: loading ? '#ccc' : '#06D6A0', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: (file && !loading) ? 'pointer' : 'not-allowed'
            }}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
          <button 
            onClick={onCancel} 
            disabled={loading}
            style={{ 
              padding: '10px 20px', 
              background: loading ? '#ccc' : '#ddd', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
