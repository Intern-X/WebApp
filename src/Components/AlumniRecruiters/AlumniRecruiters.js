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
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Meta from "antd/es/card/Meta.js";
import Navbar from "../../Navbar/Navbar.js";
import { Content } from "antd/es/layout/layout.js";
import { useSelector } from "react-redux";
import "./AlumniRecruiters.css";
import AuthContext from "../AuthContext/AuthContext.js";
import { UNAUTHORIZED } from "../../Utils/UserStates.js";

const { TabPane } = Tabs;
const { Option } = Select;

function AlumniRecruiters() {
  // REDUX
  const { refresh } = useSelector((state) => state.status);
  const { loading } = useSelector((state) => state.status);

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

  const [recruiterList, setRecruiterList] = useState([
    {
      id: "recruiter1",
      name: "Emily Davis",
      title: "Technical Recruiter",
      company: "Apple",
      imageUrl: "https://api.dicebear.com/7.x/miniavs/svg?seed=recruiter1",
      experience: "5 years",
      tags: ["Software", "Engineering", "TechRecruitment"],
      industry: "Technology"
    },
    {
      id: "recruiter2",
      name: "Robert Martinez",
      title: "Talent Acquisition Manager",
      company: "Facebook",
      imageUrl: "https://api.dicebear.com/7.x/miniavs/svg?seed=recruiter2",
      experience: "8 years",
      tags: ["TalentAcquisition", "Engineering", "Leadership"],
      industry: "Technology"
    },
    {
      id: "recruiter3",
      name: "Michelle White",
      title: "University Recruiter",
      company: "Tesla",
      imageUrl: "https://api.dicebear.com/7.x/miniavs/svg?seed=recruiter3",
      experience: "4 years",
      tags: ["CampusRecruitment", "Engineering", "InternPrograms"],
      industry: "Automotive"
    },
    {
      id: "recruiter4",
      name: "Daniel Brown",
      title: "Senior Technical Recruiter",
      company: "Netflix",
      imageUrl: "https://api.dicebear.com/7.x/miniavs/svg?seed=recruiter4",
      experience: "7 years",
      tags: ["Software", "Engineering", "MediaTech"],
      industry: "Entertainment"
    },
    {
      id: "recruiter5",
      name: "Jessica Wong",
      title: "Global Recruiting Lead",
      company: "KPMG",
      imageUrl: "https://api.dicebear.com/7.x/miniavs/svg?seed=recruiter5",
      experience: "10 years",
      tags: ["Consulting", "Accounting", "Leadership"],
      industry: "Consulting"
    },
  ]);

  // All available industries from both lists
  const allIndustries = [...new Set([
    ...alumniList.map(alumni => alumni.industry),
    ...recruiterList.map(recruiter => recruiter.industry)
  ])];

  // All available tags from both lists
  const allTags = [...new Set([
    ...alumniList.flatMap(alumni => alumni.tags),
    ...recruiterList.flatMap(recruiter => recruiter.tags)
  ])].map(tag => ({ label: tag, value: tag }));

  // LOADING CARDS
  const loadingCards = Array(4).fill({
    name: <Skeleton active />,
    id: "",
    image: "",
    content: "",
    tags: [],
  });

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

  const filteredRecruiters = recruiterList.filter(recruiter => {
    const matchesSearch = recruiter.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         recruiter.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recruiter.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = filterTags.length === 0 || 
                       filterTags.some(tag => recruiter.tags.includes(tag));
    
    const matchesIndustry = !industryFilter || recruiter.industry === industryFilter;
    
    return matchesSearch && matchesTags && matchesIndustry;
  });

  // REDIRECT TO LOGIN IF NOT AUTHENTICATED
  useEffect(() => {
    if (userImpl == UNAUTHORIZED) {
      navigate("/");
    }
  }, [refresh, navigate]);

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
      key={recruiter.id}
      style={{ width: 300, margin: "1rem" }}
      className="card1 glow"
      onClick={() => navigate(`/recruiters/${recruiter.id}`)}
    >
      <Meta
        avatar={
          <Avatar
            src={recruiter.imageUrl}
            size={50}
            style={{ marginRight: "15px" }}
          />
        }
        title={recruiter.name}
        description={`${recruiter.title} at ${recruiter.company}`}
      />
      <div style={{ margin: "10px 0" }}>
        <p>Experience: {recruiter.experience}</p>
      </div>
      <Space size={[0, 8]} wrap>
        {recruiter.tags.map((tag) => {
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
                  Build your professional network and explore career opportunities.
                </h3>
                
                {/* Search and Filter Section */}
                <Row gutter={16} style={{ marginBottom: 24 }}>
                  <Col span={8}>
                    <Input 
                      placeholder="Search by name, company, or title" 
                      prefix={<SearchOutlined />}
                      onChange={(e) => handleSearch(e.target.value)}
                      size="large"
                    />
                  </Col>
                  <Col span={8}>
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
                  </Col>
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
                        {(loading ? loadingCards : filteredRecruiters).map((recruiter) => (
                          recruiter.name ? renderRecruiterCard(recruiter) : recruiter
                        ))}
                        {filteredRecruiters.length === 0 && !loading && (
                          <div style={{ margin: "20px auto", textAlign: "center" }}>
                            <h3>No recruiters found matching your criteria</h3>
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