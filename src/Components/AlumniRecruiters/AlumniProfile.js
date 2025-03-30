import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ConfigProvider,
  Layout,
  theme,
  Card,
  Row,
  Col,
  Avatar,
  Tag,
  Button,
  Divider,
  List,
  Typography,
  Breadcrumb,
  Skeleton,
  Timeline,
  Collapse,
  Modal,
  Input,
  message
} from "antd";
import {
  MailOutlined,
  LinkedinOutlined,
  CalendarOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ReloadOutlined,
  ScheduleOutlined,
  CopyOutlined,
  SendOutlined
} from "@ant-design/icons";
import { Content } from "antd/es/layout/layout.js";
import { useSelector } from "react-redux";
import AuthContext from "../AuthContext/AuthContext.js";
import { UNAUTHORIZED } from "../../Utils/UserStates.js";
import Navbar from "../../Navbar/Navbar.js";
import generateEmail from "../../Utils/generateEmail.js";

const { Meta } = Card;
const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;
const { TextArea } = Input;

function RecruiterProfile() {
  // REDUX AND AUTH
  const { refresh } = useSelector((state) => state.status);
  const {userInfo} = useSelector((state)=>state.userInfo)
  const { userImpl } = useContext(AuthContext);

  // NAVIGATION
  const navigate = useNavigate();
  const { id } = useParams();

  // ANTD CONFIG
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // STATE
  const [loading, setLoading] = useState(true);
  const [recruiter, setRecruiter] = useState(null);
  const [emailContent, setEmailContent] = useState("");
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [emailSubject, setEmailSubject] = useState("");


  // MOCK DATA - In a real app, you would fetch this based on the ID
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRecruiter({
        id: id,
        name: "Emily Davis",
        title: "Technical Recruiter",
        company: "Apple",
        imageUrl: "https://api.dicebear.com/7.x/miniavs/svg?seed=" + id,
        email: "emily.davis@apple.com",
        phone: "+1 (555) 987-6543",
        location: "Cupertino, CA",
        linkedin: "emily-davis-recruiter",
        tags: ["Software", "Engineering", "TechRecruitment", "iOS", "MachineLearning"],
        industry: "Technology",
        experience: "5 years",
        bio: "Technical recruiter with 5 years of experience hiring top engineering talent. Passionate about connecting the right people with the right opportunities and helping students launch successful careers in tech.",
        hiring: [
          {
            role: "Software Engineer",
            level: "Entry Level/New Grad",
            team: "iOS Development",
            description: "Looking for new graduates with iOS development experience or strong mobile programming fundamentals."
          },
          {
            role: "Machine Learning Engineer",
            level: "Internship",
            team: "AI/ML Research",
            description: "Seeking ML/AI students for summer internships focused on natural language processing."
          },
          {
            role: "UX Designer",
            level: "Entry Level/New Grad",
            team: "Human Interface",
            description: "Seeking designers with a portfolio demonstrating creative problem solving and user-centered design."
          }
        ],
        career_history: [
          {
            title: "Technical Recruiter",
            company: "Apple",
            duration: "2020 - Present",
            description: "Recruiting software engineers, ML specialists, and UX designers."
          },
          {
            title: "University Recruiter",
            company: "Facebook",
            duration: "2018 - 2020",
            description: "Led campus recruiting initiatives at top engineering schools."
          },
          {
            title: "Recruiting Coordinator",
            company: "Amazon",
            duration: "2016 - 2018",
            description: "Coordinated technical interviews and candidate experiences."
          }
        ],
        events: [
          {
            name: "Apple Career Fair",
            date: "October 15, 2023",
            location: "Virtual",
            description: "Annual career fair for software engineering and design roles."
          },
          {
            name: "Women in Tech Mixer",
            date: "November 5, 2023",
            location: "San Francisco",
            description: "Networking event for women pursuing careers in technology."
          }
        ],
        tips: [
          "Focus your resume on projects and experience relevant to the role you're applying for",
          "Practice coding problems on platforms like LeetCode or HackerRank before technical interviews",
          "Research the company and prepare thoughtful questions about their products and technology",
          "Don't just highlight technical skills - we value communication and teamwork equally",
          "Follow up after every interview with a thank you note that references specific conversation points"
        ]
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  // REDIRECT TO LOGIN IF NOT AUTHENTICATED
  useEffect(() => {
    if (userImpl == UNAUTHORIZED) {
      navigate("/");
    }
  }, [refresh, navigate]);

  // Handle email generation
  const handleGenerateEmail = () => {
    setIsEmailModalVisible(true);
    setEmailContent("Generating email...");
    setEmailSubject("Generating subject...");
    setIsGenerating(true);
    generateEmail(recruiter, userInfo, (response) => {
      setEmailContent(response.content || "");
      setEmailSubject(response.subject || `Introduction - ${userInfo.name || 'Prospective Candidate'}`);
      setIsGenerating(false);
    });
  };

  // Copy email to clipboard
  const copyToClipboard = () => {
    const textToCopy = `Subject: ${emailSubject}\n\n${emailContent}`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        messageApi.open({
          type: 'success',
          content: 'Email copied to clipboard!',
        });
      })
      .catch(err => {
        messageApi.open({
          type: 'error',
          content: 'Failed to copy: ' + err,
        });
      });
  };

  // Open email in user's email client
  const openInEmailClient = () => {
    if (!recruiter || !emailContent) return;
    
    const mailtoUrl = `mailto:${recruiter.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailContent)}`;
    
    window.open(mailtoUrl, '_blank');
  };

  // RENDER
  if (loading) {
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
          <Layout
            style={{
              padding: "24px 100px 24px",
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
            >
              <Skeleton active paragraph={{ rows: 20 }} />
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#786AC9",
        },
      }}
    >
      {contextHolder}
      <Layout className="white">
        <Navbar tab={"3"} />
        <Layout
          style={{
            padding: "24px 100px 24px",
          }}
          className="white"
        >
          <Breadcrumb style={{ margin: "16px 0 32px" }}>
            <Breadcrumb.Item>
              <a href="/alumni-recruiters">Back to Alumni & Recruiters</a>
            </Breadcrumb.Item>
          </Breadcrumb>

          <Content
            style={{
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Row gutter={24}>
              {/* Left Column - Profile Info */}
              <Col span={8}>
                <Card className="profile-card">
                  <Meta
                    avatar={
                      <Avatar
                        src={recruiter.imageUrl}
                        size={100}
                        style={{ marginBottom: "10px" }}
                      />
                    }
                    title={recruiter.name}
                    description={`${recruiter.title} at ${recruiter.company}`}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  />
                  <Divider />

                  <div>
                    <div style={{ marginBottom: "5px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "1rem",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <MailOutlined style={{ marginRight: 13 }} />
                          <span style={{ fontWeight: "bold" }}>Email</span>
                        </div>
                        <span style={{ marginLeft: 8 }}>
                          <a href={`mailto:${recruiter.email}`}>{recruiter.email}</a>
                        </span>
                      </div>
                    </div>

                    <div style={{ marginBottom: "5px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "1rem",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <PhoneOutlined style={{ marginRight: 13 }} />
                          <span style={{ fontWeight: "bold" }}>Phone</span>
                        </div>
                        <span style={{ marginLeft: 8 }}>{recruiter.phone}</span>
                      </div>
                    </div>

                    <div style={{ marginBottom: "5px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "1rem",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <LinkedinOutlined style={{ marginRight: 13 }} />
                          <span style={{ fontWeight: "bold" }}>LinkedIn</span>
                        </div>
                        <span style={{ marginLeft: 8 }}>
                          <a href={`https://linkedin.com/in/${recruiter.linkedin}`}  target="_blank">{recruiter.linkedin}</a>
                        </span>
                      </div>
                    </div>

                    <div style={{ marginBottom: "5px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "1rem",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <EnvironmentOutlined style={{ marginRight: 13 }} />
                          <span style={{ fontWeight: "bold" }}>Location</span>
                        </div>
                        <span style={{ marginLeft: 8 }}>{recruiter.location}</span>
                      </div>
                    </div>

                    <div style={{ marginBottom: "5px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "1rem",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <CalendarOutlined style={{ marginRight: 13 }} />
                          <span style={{ fontWeight: "bold" }}>Experience</span>
                        </div>
                        <span style={{ marginLeft: 8 }}>{recruiter.experience}</span>
                      </div>
                    </div>

                    <Divider orientation="left">Expertise Areas</Divider>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                      {recruiter.tags.map(tag => (
                        <Tag color="#786AC9" key={tag}>{tag}</Tag>
                      ))}
                    </div>
                  </div>

                  <Divider orientation="left">Connect</Divider>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <Button type="primary">Schedule a Meeting</Button>
                    <Button onClick={handleGenerateEmail}>Generate Cold Email</Button>
                    <Button>Share Resume</Button>
                  </div>
                </Card>
              </Col>

              {/* Right Column - Experience & Opportunities */}
              <Col span={16}>
                <Card>
                  <Title level={4}>About</Title>
                  <Paragraph>{recruiter.bio}</Paragraph>

                  <Divider />
                  <Title level={4}>Currently Hiring</Title>
                  <List
                    itemLayout="vertical"
                    dataSource={recruiter.hiring}
                    renderItem={(item, index) => (
                      <List.Item
                        extra={
                          <Button type="primary">Apply Now</Button>
                        }
                      >
                        <List.Item.Meta
                          title={`${item.role} (${item.level})`}
                          description={`Team: ${item.team}`}
                        />
                        <Paragraph>{item.description}</Paragraph>
                      </List.Item>
                    )}
                  />

                  <Divider />
                  <Title level={4}>Career History</Title>
                  <Timeline>
                    {recruiter.career_history.map((career, index) => (
                      <Timeline.Item key={index}>
                        <Text strong>{career.title}</Text> at <Text strong>{career.company}</Text>
                        <br />
                        <Text type="secondary">{career.duration}</Text>
                        <br />
                        <Paragraph>{career.description}</Paragraph>
                      </Timeline.Item>
                    ))}
                  </Timeline>

                  <Divider />
                  <Title level={4}>Upcoming Events</Title>
                  <List
                    itemLayout="horizontal"
                    dataSource={recruiter.events}
                    renderItem={(item, index) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<ScheduleOutlined style={{ fontSize: 24 }} />}
                          title={item.name}
                          description={
                            <>
                              <div>{item.date} | {item.location}</div>
                              <div>{item.description}</div>
                            </>
                          }
                        />
                      </List.Item>
                    )}
                  />

                  <Divider />
                  <Title level={4}>Recruiting Tips</Title>
                  <Collapse defaultActiveKey={['1']} style={{ marginBottom: "24px" }}>
                    <Panel header="Tips for Landing Your Dream Job" key="1">
                      <ul>
                        {recruiter.tips.map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                    </Panel>
                  </Collapse>
                </Card>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>

      {/* Email Modal */}
      <Modal
        title="Generated Cold Email"
        open={isEmailModalVisible}
        onOk={() => setIsEmailModalVisible(false)}
        onCancel={() => setIsEmailModalVisible(false)}
        width={700}
        footer={[
          <div key="left-buttons" style={{ float: 'left' }}>
            <Button
              icon={<CopyOutlined />}
              onClick={copyToClipboard}
              style={{ marginRight: '8px' }}
            >
              Copy to Clipboard
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleGenerateEmail}
              loading={isGenerating}
              style={{ marginRight: '8px' }}
            >
              Generate Again
            </Button>
            <Button
              icon={<SendOutlined />}
              onClick={openInEmailClient}
              type="primary"
            >
              Open in Email Client
            </Button>
          </div>,
          <Button key="close" onClick={() => setIsEmailModalVisible(false)}>
            Close
          </Button>
        ]}
      >
        <div style={{ marginBottom: '12px', marginTop: '16px' }}>
          <label htmlFor="email-subject">Subject:</label>
          <Input
            id="email-subject"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            style={{ marginTop: '4px' }}
          />
        </div>
        <label htmlFor="email-body">Email Body:</label>
        <TextArea
          id="email-body"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          autoSize={{ minRows: 10, maxRows: 20 }}
          style={{ marginTop: '4px' }}
        />
      </Modal>
    </ConfigProvider>
  );
}

export default RecruiterProfile;