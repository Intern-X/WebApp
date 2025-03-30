import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import {
  ConfigProvider,
  Layout,
  theme,
  Card,
  Row,
  Col,
  Avatar,
  Tabs,
  Select,
  Input,
  Button,
  List,
  Tag,
  Space,
  Skeleton,
  message,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Meta from "antd/es/card/Meta.js";
import Navbar from "../../Navbar/Navbar.js";
import { Content } from "antd/es/layout/layout.js";
import { useSelector } from "react-redux";
import "./AlumniRecruiters.css";
import AuthContext from "../AuthContext/AuthContext.js";
import { UNAUTHORIZED } from "../../Utils/UserStates.js";
import RequestUtils from "../../Utils/RequestUtils.js";

const { TabPane } = Tabs;
const { Option } = Select;

function AlumniRecruiters() {
  // REDUX
  const { refresh } = useSelector((state) => state.status);
  const { loading } = useSelector((state) => state.status);

  const recruiters = [
    {
      id: "recruiter1",
      name: "Emily Davis",
      title: "Technical Recruiter",
      position: "Technical Recruiter", // Added field (mirrors title)
      company: "Apple",
      email: "emily.davis@apple.com",  // Added email field
      imageUrl: "https://api.dicebear.com/7.x/miniavs/svg?seed=recruiter1",
      experience: "5 years",
      tags: ["Software", "Engineering", "TechRecruitment"],
      industry: "Technology",
    },
    {
      id: "recruiter2",
      name: "Robert Martinez",
      title: "Talent Acquisition Manager",
      position: "Talent Acquisition Manager",
      company: "Facebook",
      email: "robert.martinez@facebook.com",
      imageUrl: "https://api.dicebear.com/7.x/miniavs/svg?seed=recruiter2",
      experience: "8 years",
      tags: ["TalentAcquisition", "Engineering", "Leadership"],
      industry: "Technology"
    },
    {
      id: "recruiter3",
      name: "Michelle White",
      title: "University Recruiter",
      position: "University Recruiter",
      company: "Tesla",
      email: "michelle.white@tesla.com",
      imageUrl: "https://api.dicebear.com/7.x/miniavs/svg?seed=recruiter3",
      experience: "4 years",
      tags: ["CampusRecruitment", "Engineering", "InternPrograms"],
      industry: "Automotive"
    },
    {
      id: "recruiter4",
      name: "Daniel Brown",
      title: "Senior Technical Recruiter",
      position: "Senior Technical Recruiter",
      company: "Netflix",
      email: "daniel.brown@netflix.com",
      imageUrl: "https://api.dicebear.com/7.x/miniavs/svg?seed=recruiter4",
      experience: "7 years",
      tags: ["Software", "Engineering", "MediaTech"],
      industry: "Entertainment"
    },
    {
      id: "recruiter5",
      name: "Jessica Wong",
      title: "Global Recruiting Lead",
      position: "Global Recruiting Lead",
      company: "KPMG",
      email: "jessica.wong@kpmg.com",
      imageUrl: "https://api.dicebear.com/7.x/miniavs/svg?seed=recruiter5",
      experience: "10 years",
      tags: ["Consulting", "Accounting", "Leadership"],
      industry: "Consulting"
    },
  ];
  

  const { allProjects } = useSelector((state) => state.projects);

  console.log(allProjects);
  console.log(recruiters);
  // ANTD CONFIG
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const colors = ["success", "processing", "error", "warning", "default"];

  // NAVIGATION
  const navigate = useNavigate();

  // AUTHENTICATION
  const { userImpl } = useContext(AuthContext);

  // STATE
  const [activeTab, setActiveTab] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTags, setFilterTags] = useState([]);
  const [industryFilter, setIndustryFilter] = useState("");
  const [displayedRecruiters, setDisplayedRecruiters] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const getCompany = (email) => {
    if (!email) return ""; // or a fallback image URL
    let domain = email.split("@")[1];
    domain = domain.split(".")[0];
    domain = domain.charAt(0).toUpperCase() + domain.slice(1).toLowerCase();
    return domain;
  };

  // MOCK DATA - In a real app, you would fetch this from an API
  const [alumniList, setAlumniList] = useState([
    {
      id: "alumni1",
      name: "Alex Johnson",
      title: "Software Engineer",
      company: "Google",
      imageUrl: "https://api.dicebear.com/7.x/miniavs/svg?seed=alumni1",
      gradYear: "2020",
      tags: ["Software", "MachineLearning", "Cloud"],
      industry: "Technology"
    },
    {
      id: "alumni2",
      name: "Sarah Williams",
      title: "Product Manager",
      company: "Microsoft",
      imageUrl: "https://api.dicebear.com/7.x/miniavs/svg?seed=alumni2",
      gradYear: "2019",
      tags: ["ProductManagement", "Strategy", "Leadership"],
      industry: "Technology"
    },
    {
      id: "alumni3",
      name: "Michael Chen",
      title: "Data Scientist",
      company: "Amazon",
      imageUrl: "https://api.dicebear.com/7.x/miniavs/svg?seed=alumni3",
      gradYear: "2021",
      tags: ["DataAnalysis", "MachineLearning", "Statistics"],
      industry: "Technology"
    },
    {
      id: "alumni4",
      name: "Jennifer Lopez",
      title: "Management Consultant",
      company: "BCG",
      imageUrl: "https://api.dicebear.com/7.x/miniavs/svg?seed=alumni4",
      gradYear: "2018",
      tags: ["Consulting", "Strategy", "BusinessAnalysis"],
      industry: "Consulting"
    },
    {
      id: "alumni5",
      name: "David Kim",
      title: "Investment Banker",
      company: "Goldman Sachs",
      imageUrl: "https://api.dicebear.com/7.x/miniavs/svg?seed=alumni5",
      gradYear: "2017",
      tags: ["Finance", "Investment", "Banking"],
      industry: "Finance"
    },
  ]);

  const [domainList, setDomainList] = useState([
    "apple.com", "microsoft.com", "google.com", "amazon.com", "facebook.com"
  ]);

  const [recruiterList, setRecruiterList] = useState([]);
  const [filteredRecruiters, setFilteredRecruiters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Process industries from alumni list
  const alumniIndustries = [...new Set(alumniList.map(alumni => alumni.industry))];
  
  // Process tags from alumni list
  const alumniTags = [...new Set(alumniList.flatMap(alumni => alumni.tags))].map(tag => ({ label: tag, value: tag }));
  
  // Default industries for recruiters based on their companies
  const getIndustryFromDomain = (domain) => {
    if (domain.includes("apple") || domain.includes("google") || domain.includes("microsoft") || 
        domain.includes("facebook") || domain.includes("amazon")) {
      return "Technology";
    } else if (domain.includes("goldmansachs") || domain.includes("jpmorgan") || 
              domain.includes("morganstanley")) {
      return "Finance";
    } else if (domain.includes("bcg") || domain.includes("mckinsey") || domain.includes("bain")) {
      return "Consulting";
    } else {
      return "Other";
    }
  };

  // FILTERING LOGIC
  const filteredAlumni = alumniList.filter(alumni => {
    const matchesSearch = alumni.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         alumni.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alumni.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = filterTags.length === 0 || 
                       filterTags.some(tag => alumni.tags.includes(tag));
    
    const matchesIndustry = !industryFilter || alumni.industry === industryFilter;
    
    return matchesSearch && matchesTags && matchesIndustry;
  });

  // Handle company search
  const handleCompanySearch = () => {
    if (!searchQuery.trim()) {
      message.warning("Please enter a company name");
      return;
    }

    // Only proceed with company search if we're on the Recruiters tab
    if (activeTab !== "2") {
      return;
    }

    // Format the company search into a domain
    let domain = searchQuery.toLowerCase().trim();
    
    // Add .com if it's not already there and no other domain extension is present
    if (!domain.includes(".")) {
      domain = domain + ".com";
    }
    
    setIsSearching(true);
    
    RequestUtils.get(`/recruiters?domain=${domain}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success === true) {
          setDisplayedRecruiters(data.emails || []);
          
          if (data.emails && data.emails.length > 0) {
            message.success(`Found ${data.emails.length} recruiters at ${searchQuery}`);
          } else {
            message.info(`No recruiters found at ${searchQuery}`);
          }
        } else {
          message.error("Error fetching recruiters");
          setDisplayedRecruiters([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        message.error("Failed to fetch recruiters");
        setDisplayedRecruiters([]);
      })
      .finally(() => {
        setIsSearching(false);
      });
  };

  console.log(filteredRecruiters);

  // REDIRECT TO LOGIN IF NOT AUTHENTICATED
  useEffect(() => {
    if (userImpl === UNAUTHORIZED) {
      navigate("/");
      return;
    }

    setIsLoading(false);
    
    // Initially set displayed recruiters to the default list
    setDisplayedRecruiters(recruiters);
  }, [userImpl, refresh]);

  // Get all industries combining both lists
  const allIndustries = [...new Set([
    ...alumniIndustries,
    ...recruiterList.map(recruiter => recruiter.industry || "Other")
  ])];

  // Get all tags combining both lists
  const allTags = [...new Set([
    ...alumniList.flatMap(alumni => alumni.tags),
    ...recruiterList.flatMap(recruiter => recruiter.tags || [])
  ])].map(tag => ({ label: tag, value: tag }));

  // LOADING CARDS
  const loadingCards = Array(4).fill({
    name: <Skeleton active />,
    id: "",
    image: "",
    content: "",
    tags: [],
  });

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleTagChange = (tags) => {
    setFilterTags(tags);
  };

  const handleIndustryChange = (value) => {
    setIndustryFilter(value);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    
    // Reset to default recruiters when switching tabs
    if (key === "2") {
      setDisplayedRecruiters(recruiters);
    }
  };

  // RENDER ALUMNI CARD
  const renderAlumniCard = (alumni) => (
    <Card
      key={alumni.id}
      style={{ width: 300, margin: "1rem" }}
      className="card1 glow"
      onClick={() => navigate(`/alumni/${alumni.id}`)}
    >
      <Meta
        avatar={
          <Avatar
            src={alumni.imageUrl}
            size={50}
            style={{ marginRight: "15px" }}
            shape="square"
          />
        }
        title={alumni.name}
        description={`${alumni.title} at ${alumni.company}`}
      />
      <div style={{ margin: "10px 0" }}>
        <p>Graduation Year: {alumni.gradYear}</p>
      </div>
      <Space size={[0, 8]} wrap>
        {alumni.tags.map((tag) => {
          const color = colors[Math.floor(Math.random() * colors.length)];
          return <Tag color={color} key={tag}>{tag}</Tag>;
        })}
      </Space>
    </Card>
  );

  // RENDER RECRUITER CARD
  const renderRecruiterCard = (recruiter) => (
    <Card
      key={recruiter.email}
      style={{ width: 300, margin: "1rem" }}
      className="card1 glow"
      onClick={() => navigate(`/recruiters/${recruiter.id}`)}
    >
      <Meta
        avatar={
          <Avatar
          src={recruiter.imageUrl || "https://logo.clearbit.com/" + getCompany(recruiter.email) + ".com"}
            size={50}
            style={{ marginRight: "15px" }}
          />
        }
        title={recruiter.name}
        description={`${recruiter.position} at ${getCompany(recruiter.email)}`}
      />
      <div style={{ margin: "10px 0" }}>
        <p>Email: {recruiter.email}</p>
        {/* <p>Experience: {recruiter.position}</p> */}
      </div>
      <Space size={[0, 8]} wrap>
        {(recruiter.tags || []).map((tag) => {
          const color = colors[Math.floor(Math.random() * colors.length)];
          return <Tag color={color} key={tag}>{tag}</Tag>;
        })}
      </Space>
    </Card>
  );

  // RENDER
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#786AC9",
        },
      }}
    >
      <Layout className="white">
        <Navbar tab={"3"} />
        <Layout>
          <Layout
            style={{
              padding: "24px 80px 24px",
            }}
            className="white"
          >
            <Content
              style={{
                margin: 0,
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
              className="mx-auto"
            >
              <div
                style={{
                  padding: "0 20px",
                }}
              >
                <h1>Alumni & Recruiters</h1>
                <h3 style={{ fontWeight: "normal" }}>
                  Connect with alumni who've been in your shoes or recruiters looking for talent like you.
                  Popular company recruiters are listed below. Sort by industry, skills, and more.
                </h3>
                
                {/* Search and Filter Section */}
                <Row gutter={16} style={{ marginBottom: 24 }}>
                  <Col span={activeTab === "2" ? 6 : 8}>
                    <Input 
                      placeholder={activeTab === "2" ? "Search by company (e.g. apple)" : "Search by name, company, or title"} 
                      prefix={<SearchOutlined />}
                      onChange={(e) => handleSearch(e.target.value)}
                      value={searchQuery}
                      size="large"
                      onPressEnter={activeTab === "2" ? handleCompanySearch : undefined}
                    />
                  </Col>
                  {activeTab === "2" && (
                    <Col span={2}>
                      <Button 
                        type="primary" 
                        size="large" 
                        onClick={handleCompanySearch}
                        loading={isSearching}
                        style={{ width: '100%' }}
                      >
                        Go
                      </Button>
                    </Col>
                  )}
                  {/* <Col span={8}>
                    <Select
                      mode="multiple"
                      allowClear
                      style={{ width: '100%' }}
                      placeholder="Filter by skills/interests"
                      onChange={handleTagChange}
                      options={allTags}
                      size="large"
                    />
                  </Col>
                  <Col span={8}>
                    <Select
                      allowClear
                      style={{ width: '100%' }}
                      placeholder="Filter by industry"
                      onChange={handleIndustryChange}
                      size="large"
                    >
                      {allIndustries.map(industry => (
                        <Option key={industry} value={industry}>{industry}</Option>
                      ))}
                    </Select>
                  </Col> */}
                </Row>

                {/* Tabs for Alumni and Recruiters */}
                <Tabs defaultActiveKey="1" onChange={handleTabChange}>
                  <TabPane tab="Alumni" key="1">
                    <div className="mx-auto">
                      <Row>
                        {(loading ? loadingCards : filteredAlumni).map((alumni) => (
                          alumni.name ? renderAlumniCard(alumni) : alumni
                        ))}
                        {filteredAlumni.length === 0 && !loading && (
                          <div style={{ margin: "20px auto", textAlign: "center" }}>
                            <h3>No alumni found matching your criteria</h3>
                          </div>
                        )}
                      </Row>
                    </div>
                  </TabPane>
                  <TabPane tab="Recruiters" key="2">
                    <div className="mx-auto">
                      <Row>
                        {isSearching ? (
                          loadingCards.map((_, index) => (
                            <Card
                              key={index}
                              style={{ width: 300, margin: "1rem" }}
                              className="card1"
                            >
                              <Skeleton active avatar paragraph={{ rows: 4 }} />
                            </Card>
                          ))
                        ) : (
                          displayedRecruiters.map((recruiter) =>
                            recruiter.name || recruiter.firstName ? renderRecruiterCard(recruiter) : null
                          )
                        )}
                        {displayedRecruiters.length === 0 && !isSearching && (
                          <div style={{ margin: "20px auto", textAlign: "center" }}>
                            <h3>No recruiters found matching your criteria</h3>
                            <p>Try searching for a specific company using the search bar above</p>
                          </div>
                        )}
                      </Row>
                    </div>
                  </TabPane>
                </Tabs>
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default AlumniRecruiters;