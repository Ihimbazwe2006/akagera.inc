import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import ImageCarousel from '../components/ImageCarousel';
import { appAPI } from '../api';

// Get API Base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://akagerainc.onrender.com/api';
const UPLOADS_URL = API_BASE_URL.replace('/api', '');

// Helper function to build image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${UPLOADS_URL}/uploads/${imagePath}`;
};

function Apps() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLicense, setFilterLicense] = useState('all');

  useEffect(() => {
    const fetchApps = async () => {
      try {
        console.log('Fetching apps from API...');
        const response = await appAPI.getAll();
        console.log('Apps response:', response);
        
        if (response.data && Array.isArray(response.data)) {
          setApps(response.data);
          console.log(`Successfully loaded ${response.data.length} apps`);
        } else {
          console.warn('Response data is not an array:', response.data);
          setApps([]);
        }
      } catch (error) {
        console.error('Error fetching apps:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  const filteredApps = apps.filter(app => {
    const appName = app.name || '';
    const appDesc = app.short_description || '';
    const matchesSearch = appName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appDesc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterLicense === 'all' || 
                         (filterLicense === 'licensed' && app.requires_license) ||
                         (filterLicense === 'free' && !app.requires_license);
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      {/* Hero Carousel Section */}
      <section className="hero">
        <ImageCarousel autoSlide={true} interval={5000} />
        
        <div className="hero-overlay">
          <div className="container">
            <div className="hero-content">
              <div className="hero-text" data-aos="fade-right">
                <h1>Our Applications</h1>
                <p>
                  Discover our collection of mobile applications designed to boost your productivity, streamline your workflow, and make everyday tasks easier. Whether you need tools for business, education, or personal use, Akagera Inc provides high-quality apps that are secure, efficient, and easy to use.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <div
  style={{
    minHeight: "calc(100vh - 700px)",
    paddingTop: "40px",
    marginBottom: "120px",
    background: "#fff",
  }}
>
  <div className="container">

    {/* Search + Filter */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "18px",
        marginBottom: "35px",
      }}
    >
      <div className="form-group">
        <label
          style={{
            fontWeight: "600",
            marginBottom: "8px",
            display: "block",
            color: "#111",
          }}
        >
          Search Apps
        </label>

        <input
          type="text"
          placeholder="Search apps..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            border: "1px solid #ddd",
            outline: "none",
            fontSize: "0.95rem",
            background: "#fafafa",
          }}
        />
      </div>

      <div className="form-group">
        <label
          style={{
            fontWeight: "600",
            marginBottom: "8px",
            display: "block",
            color: "#111",
          }}
        >
          Filter Apps
        </label>

        <select
          value={filterLicense}
          onChange={(e) => setFilterLicense(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            border: "1px solid #ddd",
            outline: "none",
            fontSize: "0.95rem",
            background: "#fafafa",
          }}
        >
          <option value="all">All Apps</option>
          <option value="free">Free Apps</option>
          <option value="licensed">Licensed Apps</option>
        </select>
      </div>
    </div>

    {/* Apps */}
    {loading ? (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div className="spinner"></div>
      </div>
    ) : filteredApps.length === 0 ? (
      <div
        style={{
          textAlign: "center",
          padding: "70px 20px",
          background: "#fafafa",
          border: "1px solid #eee",
        }}
      >
        <h3
          style={{
            color: "#111",
            marginBottom: "10px",
          }}
        >
          No apps found
        </h3>

        <p style={{ color: "#666" }}>
          Try changing your search or filters
        </p>
      </div>
    ) : (
      <div
        className="apps-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "24px",
        }}
      >
        {filteredApps.map((app, index) => (
          <div
            key={app.id}
            data-aos="fade-up"
            data-aos-delay={index * 70}
            style={{
              background: "#fff",
              overflow: "hidden",
              transition: "0.25s ease",
              border: "1px solid #eee",
              width: "300px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow =
                "0 8px 24px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Image */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "220px",
                background: "#f5f5f5",
                overflow: "hidden",
              }}
            >
              {app.app_logo ? (
                <img
                  src={getImageUrl(app.app_logo)}
                  alt={app.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML =
                      '<div style="font-size:55px;color:#bbb;height:100%;display:flex;align-items:center;justify-content:center;">📱</div>';
                  }}
                />
              ) : (
                <div
                  style={{
                    fontSize: "55px",
                    color: "#bbb",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  📱
                </div>
              )}

              {/* Badge */}
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                }}
              >
                <span
                  style={{
                    background: app.requires_license
                      ? "#000"
                      : "#1b1b1b",
                    color: "#fff",
                    padding: "6px 10px",
                    fontSize: "0.72rem",
                    fontWeight: "600",
                  }}
                >
                  {app.requires_license ? "Licensed" : "Free"}
                </span>
              </div>
            </div>

            {/* Content */}
            <div
              style={{
                padding: "16px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  marginBottom: "8px",
                  fontSize: "1rem",
                  fontWeight: "700",
                  color: "#111",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {app.name}
              </h3>

              <p
                style={{
                  fontSize: "0.88rem",
                  color: "#666",
                  lineHeight: "1.5",
                  marginBottom: "14px",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  minHeight: "42px",
                }}
              >
                {app.short_description ||
                  app.description ||
                  "No description available"}
              </p>

              {/* Features */}
              {app.features && app.features.length > 0 && (
                <div
                  style={{
                    marginBottom: "15px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                    }}
                  >
                    {app.features.slice(0, 2).map((feature, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: "0.72rem",
                          background: "#f3f3f3",
                          padding: "5px 8px",
                          color: "#444",
                        }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Button */}
              <Link
                to={`/apps/${app.id}`}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  background: "#000",
                  color: "#fff",
                  padding: "12px",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                  transition: "0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#222";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#000";
                }}
              >
                <Download size={16} />
                Download Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</div>
    </>
  );
}

export default Apps;