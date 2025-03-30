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
  Timeline,
  Divider,
  List,
  Modal,
  Typography,
  Input,
  Breadcrumb,
  Skeleton,
  message
} from "antd";
import {
  MailOutlined,
  LinkedinOutlined,
  CalendarOutlined,
  BankOutlined,
  BookOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  ProjectOutlined,
  SendOutlined,
  CopyOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Content } from "antd/es/layout/layout.js";
import { useSelector } from "react-redux";
import AuthContext from "../AuthContext/AuthContext.js";
import { UNAUTHORIZED } from "../../Utils/UserStates.js";
import Navbar from "../../Navbar/Navbar.js";
import generateCoffeeChat from "../../Utils/generateCoffeeChat.js";
import generateReferralRequest from "../../Utils/generateReferralRequest.js";
const { Meta } = Card;
const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

function AlumniProfile() {
  // REDUX AND AUTH
  const { refresh } = useSelector((state) => state.status);
  const { userImpl } = useContext(AuthContext);
  const {userInfo} = useSelector((state)=>state.userInfo)


  // NAVIGATION
  const navigate = useNavigate();
  const { id } = useParams();

  // ANTD CONFIG
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // STATE
  const [loading, setLoading] = useState(true);
  const [alumni, setAlumni] = useState(null);
  const [emailContent, setEmailContent] = useState("");
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [emailSubject, setEmailSubject] = useState("");
  
  const [referralContent, setReferralContent] = useState("");
  const [isReferralModalVisible, setIsReferralModalVisible] = useState(false);
  const [isGeneratingReferral, setIsGeneratingReferral] = useState(false);
  const [referralSubject, setReferralSubject] = useState("");
  

  // MOCK DATA - In a real app, you would fetch this based on the ID
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAlumni({
        id: id,
        name: "Alex Johnson",
        title: "Software Engineer",
        company: "Google",
        imageUrl: "https://api.dicebear.com/7.x/miniavs/svg?seed=" + id,
        gradYear: "2020",
        email: "alex.johnson@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        linkedin: "alex-johnson",
        tags: ["Software", "MachineLearning", "Cloud", "Python", "WebDev"],
        industry: "Technology",
        bio: "Alumni with 3+ years of experience in software engineering, specializing in machine learning applications. Passionate about mentoring students and helping them prepare for careers in tech.",
        education: [
          {
            degree: "B.S. Computer Science",
            school: "Washington University In St. Louis",
            year: "2016-2020"
          }
        ],
        experience: [
          {
            title: "Software Engineer",
            company: "Google",
            duration: "2020 - Present",
            description: "Working on machine learning infrastructure for search products."
          },
          {
            title: "Software Engineering Intern",
            company: "Microsoft",
            duration: "Summer 2019",
            description: "Developed features for the Azure cloud platform."
          },
          {
            title: "Research Assistant",
            company: "Stanford AI Lab",
            duration: "2018 - 2019",
            description: "Assisted with natural language processing research."
          }
        ],
        projects: [
          {
            name: "ML Model Optimization Framework",
            description: "Led a team that built a framework to optimize machine learning models for production."
          },
          {
            name: "Healthcare Analytics Dashboard",
            description: "Created an analytics dashboard for tracking patient outcomes in real-time."
          }
        ],
        mentoring: {
          available: true,
          topics: ["Career advice", "Resume review", "Interview preparation", "Technical mentoring"],
          preferredContact: "Email"
        }
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
    const handleGenerateCoffeeChat = () => {
      setIsEmailModalVisible(true);
      setEmailContent("Generating email...");
      setEmailSubject("Generating subject...");
      setIsGenerating(true);
      generateCoffeeChat(alumni, userInfo, (response) => {
        setEmailContent(response.content || "");
        setEmailSubject(response.subject || `Introduction - ${userInfo.name || 'Prospective Candidate'}`);
        setIsGenerating(false);
      });
    };

    // Handle referral request generation
    const handleGenerateReferralRequest = () => {
      setIsReferralModalVisible(true);
      setReferralContent("Generating email...");
      setReferralSubject("Generating subject...");
      setIsGeneratingReferral(true);
      generateReferralRequest(alumni, userInfo, (response) => {
        setReferralContent(response.content || "");
        setReferralSubject(response.subject || `Referral Request - ${userInfo.name || 'Prospective Candidate'}`);
        setIsGeneratingReferral(false);
      });
    };
    
    const copyReferralToClipboard = () => {
      const textToCopy = `Subject: ${referralSubject}\n\n${referralContent}`;
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          messageApi.open({
            type: 'success',
            content: 'Referral request copied to clipboard!',
          });
        })
        .catch(err => {
          messageApi.open({
            type: 'error',
            content: 'Failed to copy: ' + err,
          });
        });
    };

    // Open referral request in user's email client
const openReferralInEmailClient = () => {
  if (!alumni || !referralContent) return;
  
  const mailtoUrl = `mailto:${alumni.email}?subject=${encodeURIComponent(referralSubject)}&body=${encodeURIComponent(referralContent)}`;
  
  window.open(mailtoUrl, '_blank');
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
      if (!alumni || !emailContent) return;
      
      const mailtoUrl = `mailto:${alumni.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailContent)}`;
      
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
                        src={alumni.imageUrl}
                        size={100}
                        style={{ marginBottom: "10px" }}
                      />
                    }
                    title={alumni.name}
                    description={`${alumni.title} at ${alumni.company}`}
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
                          <a href={`mailto:${alumni.email}`}>{alumni.email}</a>
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
                        <span style={{ marginLeft: 8 }}>{alumni.phone}</span>
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
                          <a href={`https://linkedin.com/in/${alumni.linkedin}`} target="_blank">{alumni.linkedin}</a>
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
                        <span style={{ marginLeft: 8 }}>{alumni.location}</span>
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
                          <span style={{ fontWeight: "bold" }}>Graduation</span>
                        </div>
                        <span style={{ marginLeft: 8 }}>{alumni.gradYear}</span>
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
                          <BookOutlined style={{ marginRight: 13 }} />
                          <span style={{ fontWeight: "bold" }}>Education</span>
                        </div>
                        <span style={{ marginLeft: 8 }}>{alumni.education[0].degree}</span>
                      </div>
                    </div>

                    <Divider orientation="left">Skills & Expertise</Divider>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                      {alumni.tags.map(tag => (
                        <Tag color="#786AC9" key={tag}>{tag}</Tag>
                      ))}
                    </div>
                  </div>

                  <Divider orientation="left">Mentoring</Divider>
                  <div>
                    <p><strong>Availability:</strong> {alumni.mentoring.available ? "Available" : "Unavailable"}</p>
                    <p><strong>Preferred Contact:</strong> {alumni.mentoring.preferredContact}</p>
                    <p><strong>Topics:</strong></p>
                    <ul>
                      {alumni.mentoring.topics.map((topic, index) => (
                        <li key={index}>{topic}</li>
                      ))}
                    </ul>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <Button type = "primary" onClick={handleGenerateCoffeeChat}>Generate Coffee Chat</Button>
                      <Button type="primary" onClick={handleGenerateReferralRequest}>Generate Referral Request</Button>
                      
                    </div>

                  </div>
                </Card>
              </Col>

              {/* Right Column - Experience & Projects */}
              <Col span={16}>
                <Card>
                  <Title level={4}>About</Title>
                  <Paragraph>{alumni.bio}</Paragraph>

                  <Divider />
                  <Title level={4}>Experience</Title>
                  <Timeline>
                    {alumni.experience.map((exp, index) => (
                      <Timeline.Item key={index}>
                        <Text strong>{exp.title}</Text> at <Text strong>{exp.company}</Text>
                        <br />
                        <Text type="secondary">{exp.duration}</Text>
                        <br />
                        <Paragraph>{exp.description}</Paragraph>
                      </Timeline.Item>
                    ))}
                  </Timeline>

                  <Divider />
                  <Title level={4}>Projects</Title>
                  <List
                    itemLayout="horizontal"
                    dataSource={alumni.projects}
                    renderItem={(item, index) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<ProjectOutlined style={{ fontSize: 24 }} />}
                          title={item.name}
                          description={item.description}
                        />
                      </List.Item>
                    )}
                  />

                  <Divider />
                  <Title level={4}>Education</Title>
                  <List
                    itemLayout="horizontal"
                    dataSource={alumni.education}
                    renderItem={(item, index) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<BankOutlined style={{ fontSize: 24 }} />}
                          title={item.degree}
                          description={`${item.school}, ${item.year}`}
                        />
                      </List.Item>
                    )}
                  />
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
              onClick={handleGenerateCoffeeChat}
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


      {/* Referral Request Modal */}
<Modal
  title="Generated Referral Request"
  open={isReferralModalVisible}
  onOk={() => setIsReferralModalVisible(false)}
  onCancel={() => setIsReferralModalVisible(false)}
  width={700}
  footer={[
    <div key="left-buttons" style={{ float: 'left' }}>
      <Button
        icon={<CopyOutlined />}
        onClick={copyReferralToClipboard}
        style={{ marginRight: '8px' }}
      >
        Copy to Clipboard
      </Button>
      <Button
        icon={<ReloadOutlined />}
        onClick={handleGenerateReferralRequest}
        loading={isGeneratingReferral}
        style={{ marginRight: '8px' }}
      >
        Generate Again
      </Button>
      <Button
        icon={<SendOutlined />}
        onClick={openReferralInEmailClient}
        type="primary"
      >
        Open in Email Client
      </Button>
    </div>,
    <Button key="close" onClick={() => setIsReferralModalVisible(false)}>
      Close
    </Button>
  ]}
>
  <div style={{ marginBottom: '12px', marginTop: '16px' }}>
    <label htmlFor="referral-subject">Subject:</label>
    <Input
      id="referral-subject"
      value={referralSubject}
      onChange={(e) => setReferralSubject(e.target.value)}
      style={{ marginTop: '4px' }}
    />
  </div>
  <label htmlFor="referral-body">Email Body:</label>
  <TextArea
    id="referral-body"
    value={referralContent}
    onChange={(e) => setReferralContent(e.target.value)}
    autoSize={{ minRows: 10, maxRows: 20 }}
    style={{ marginTop: '4px' }}
  />
</Modal>
    </ConfigProvider>
  );
}

export default AlumniProfile;