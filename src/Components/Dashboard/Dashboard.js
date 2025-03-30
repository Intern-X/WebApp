// Updated imports at the top
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import "./Dashboard.css";
import {
  ConfigProvider,
  Layout,
  Select,
  Image,
  theme,
  Card,
  Row,
  Col,
  Avatar,
  Form,
  Input,
  List,
  Space,
  Divider,
  Button,
  Tag,
  Breadcrumb,
  Modal,
  Skeleton,
  Spin,            // <-- Added Spin
  Empty            // (Empty is already imported)
} from "antd";
import { 
  CalendarOutlined,
  CheckCircleFilled,
  DollarCircleOutlined,
  UserOutlined,    // <-- Added UserOutlined
  MailOutlined     // <-- Added MailOutlined
} from "@ant-design/icons";
import { message } from "antd";
import { auth, logout } from "../../Firebase.js";
import RequestUtils from "../../Utils/RequestUtils.js";
import { useAuthState } from "react-firebase-hooks/auth";
import Navbar from "../../Navbar/Navbar.js";
import { Footer } from "antd/es/layout/layout.js";
import Confetti from "react-confetti";
import skillColorsJSON from "../../Utils/SkillColors.json";
import tagsJSON from "../../Utils/tags.json";
import AuthContext from "../AuthContext/AuthContext.js";
import { useDispatch, useSelector } from "react-redux";
import { UNAUTHORIZED } from "../../Utils/UserStates.js";
import { toggleLoad } from "../../redux/slices/status.js";
import ProjectStatus from "../../Utils/ProjectStatus.js";
import { setUserInfo } from "../../redux/slices/userInfo.js";

const tags = tagsJSON.tags;
const skillColors = skillColorsJSON;

const { Option } = Select;
const { Content } = Layout;

function Dashboard() {
  // REDUX
  const dispatch = useDispatch();
  const { userImpl } = useContext(AuthContext);
  const { userInfo } = useSelector((state) => state.userInfo);
  const { allProjects } = useSelector((state) => state.projects);
  const { allCompanies } = useSelector((state) => state.companies);
  const { isCompany } = useSelector((state) => state.userInfo);
  const { refresh, loading } = useSelector((state) => state.status);

  // NAVIGATION
  let navigate = useNavigate();

  // ANTD CONFIG
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [messageApi, contextHolder] = message.useMessage();

  // New state for recruiters and selected company for the project details
  const [displayedRecruiters, setDisplayedRecruiters] = useState([]);
  const [isLoadingRecruiters, setIsLoadingRecruiters] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Existing state variables
  const [projectIndex, setProjectIndex] = useState(0);
  const [selectedProjCompany, setSelectedProjCompany] = useState("");
  const [selectedProject, setSelectedProject] = useState({
    title: "loading...",
    company: "loading...",
    compensation: "loading...",
    description: "loading...",
    endDate: "loading...",
    startDate: "loading...",
    status: "loading...",
    id: "loading...",
    tags: ["loading..."],
  });
  let [signup, setSignup] = useState(false);
  let [interestCompanies, setInterestCompanies] = useState([]);
  let [interestPeople, setInterestPeople] = useState([]);
  let [name, setName] = useState("");
  let [confettiOn, setConfettiOn] = useState(false);

  // SIGNUP MODAL




  /**
   * Signs up a student
   * @param {Object} values - values from the form
   * @returns N/A
   */
  const signUpStudent = (values) => {
    let reqbody = {
      name: values.firstName + " " + values.lastName,
      email: values.email,
      gpa: values.gpa,
      linkedin: values.linkedin,
      school: values.school,
      major: values.major,
      tags: values.interests,
    };

    dispatch(setUserInfo(reqbody));

    RequestUtils.post("/student?id=" + userImpl.uid, reqbody);
    setSignup(false);
    dispatch(toggleLoad(false));
  };

  // Utility functions for message notifications (omitted for brevity)
  const success = () => {
    messageApi.open({
      type: "success",
      content: "You have successfully applied!",
    });
  };
  const applicationError = () => {
    messageApi.open({
      type: "error",
      content: "You have already applied!",
    });
  };
  const softwareError = () => {
    messageApi.open({
      type: "error",
      content: "Something went wrong!",
    });
  };
  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

  // Function to handle project applications
 const apply = () => {
  const reqObj = {
    studentId: userImpl.uid,
    projectId: selectedProject.id,
  };
  // RequestUtils.post("/application", reqObj)
  //   .then((response) => response.json())
  //   .then((data) => {
  //     if (data.status === 200) {
  //       success();
  //     } else if (data.status === 400) {
  //       applicationError();
  //     } else if (data.status === 404) {
  //       softwareError();
  //     }
  //   })
  //   .catch((error) => {
  //     console.error("Application error:", error);
  //     softwareError();
  //   });
};


  // SIGNUP MODAL and other functions remain unchanged...

  // New function to fetch recruiters for the selected company
  const fetchRecruitersForCompany = (company) => {

    console.log("hit")
    if (!company || !company.website) {
      message.error("No website available for this company");
      return;
    }
    let domain = "";
    try {
      const url = new URL(company.website);
      domain = url.hostname.replace("www.", "");
    } catch (error) {
      domain = company.website
        .replace("http://", "")
        .replace("https://", "")
        .split("/")[0];
    }
    setIsLoadingRecruiters(true);
    RequestUtils.get(`/recruiters?domain=${domain}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success === true) {
          setDisplayedRecruiters(data.emails || []);
          if (data.emails && data.emails.length > 0) {
            // message.success(`Found ${data.emails.length} recruiters at ${domain}`);
          } else {
            // message.info(`No recruiters found at ${domain}`);
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
        setIsLoadingRecruiters(false);
      });
  };

  // UPDATE PROJECT DETAILS: When a project is clicked, update details and fetch recruiters
  useEffect(() => {
    if (allProjects[projectIndex] === undefined) return;

    // Set the selected project details
    setSelectedProject({
      title: allProjects[projectIndex].title,
      company: allProjects[projectIndex].company,
      compensation: allProjects[projectIndex].compensation,
      id: allProjects[projectIndex].id,
      description: allProjects[projectIndex].description,
      endDate: allProjects[projectIndex].endDate,
      startDate: allProjects[projectIndex].startDate,
      status: allProjects[projectIndex].status,
      tags: allProjects[projectIndex].tags,
    });

    // Find the company object for the project and fetch recruiters
    let company = allCompanies.find(
      (company) => company.id === allProjects[projectIndex].company
    );
    if (company) {
      setSelectedProjCompany(company.name);
      setSelectedCompany(company);
      
      fetchRecruitersForCompany(company);
    }
  }, [projectIndex, allProjects, allCompanies]);

  // Other useEffects (signup, relevant companies, etc.) remain unchanged...
  useEffect(() => {
    if (userImpl == null) {
      return;
    }
    if (userInfo == null) {
      setSignup(true);
    } else if (userInfo.major?.length == undefined || userInfo.major?.length == 0)
      setSignup(true);
    else {
      setSignup(false);
      RequestUtils.get(
        "/relevantCompanies?tags=" + JSON.stringify(userInfo.tags)
      )
        .then((response) => response.json())
        .then((data) => {
          setInterestCompanies(data.data.splice(0, 5));
          dispatch(toggleLoad(false));
        });

      RequestUtils.get(
        "/relevantStudents?tags=" + JSON.stringify(userInfo.tags)
      )
        .then((response) => response.json())
        .then((data) => {
          let people = data.data.splice(0, 6);
          people = people.filter((u) => u.id != userImpl.uid);
          setInterestPeople(people.splice(0, 5));
        });
    }
  }, [navigate]);

  // CHECK USERIMPL STATUS
  useEffect(() => {
    console.log(userInfo);
    if (userImpl == UNAUTHORIZED) {
      navigate("/");
    } else if (userImpl) {
      isCompany
        ? navigate("/companies/" + userImpl.uid)
        : navigate("/dashboard");
    }
  }, [refresh, navigate]);

  // RENDER
  return (
    <>
      {contextHolder}
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#786AC9",
          },
        }}
      >
        <Layout className="white">
          <Navbar tab={"1"} />
          <Layout>
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
                className="mx-auto"
              >
                <Row>
                  <Col span={24}>
                    <h1>{"Dashboard"}</h1>
                    <h3 style={{ marginBottom: 32, fontWeight: "normal" }}>
                      {"Hello " +
                        (userInfo && userInfo.name ? userInfo.name.split(" ")[0] : "") +
                        "! Get started on kickstarting your career with Intern-X!"}
                    </h3>
                  </Col>
                  <Col
                    span={8}
                    style={{
                      border: "solid 1px #ededed",
                      borderRadius: "10px 0px 0px 10px",
                    }}
                  >
                    <List
                      itemLayout="vertical"
                      size="large"
                      pagination={{
                        pageSize: 5,
                        align: "center",
                      }}
                      dataSource={loading ? [] : allProjects}
                      renderItem={(item, index) => (
                        <List.Item
                          key={item.title}
                          onClick={() => setProjectIndex(index)}
                          style={{ cursor: "pointer" }}
                          className={"project-list-item"}
                          actions={[
                            <IconText
                              icon={DollarCircleOutlined}
                              text={item.compensation}
                              key="compensation"
                            />,
                            <IconText
                              icon={CheckCircleFilled}
                              text={item.status === 1 ? "Open" : "Closed"}
                              key="status"
                            />,
                            <IconText
                              icon={CalendarOutlined}
                              text={
                                item.startDate == undefined
                                  ? "loading..."
                                  : item.startDate.substring(
                                      0,
                                      item.startDate.length - 5
                                    ) +
                                    " - " +
                                    item.endDate.substring(
                                      0,
                                      item.endDate.length - 5
                                    )
                              }
                              key="timeline"
                            />,
                          ]}
                        >
                          <List.Item.Meta
                            avatar={<Avatar src={item.avatar} />}
                            title={<a href={item.href}>{item.title}</a>}
                            description={
                              loading
                                ? item.description
                                : item.description.substring(0, 100) + "..."
                            }
                          />
                        </List.Item>
                      )}
                    />
                    <br></br>
                  </Col>
                  <Col
                    span={10}
                    className="mx-2"
                    style={{
                      border: "solid 1px #ededed",
                      borderLeft: "none",
                      borderRadius: "0px 10px 10px 0px",
                      padding: "24px 32px 24px 32px",
                      margin: "0px 24px 0px 0px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <h1 style={{ margin: "0px 0px 0px" }}>
                          <span>{selectedProject.title}</span>
                        </h1>
                        <div
                          style={{
                            display: "flex",
                            alignContent: "end",
                            alignItems: "flex-end",
                            width: "290px",
                            margin: "0px",
                            padding: "0px",
                          }}
                        >
                          <b>
                            <span
                              style={{
                                color: ProjectStatus.status(
                                  selectedProject.status
                                ).statusColor,
                                marginRight: "8px",
                              }}
                            >
                              &bull;
                            </span>
                            <span
                              style={{
                                color: ProjectStatus.status(
                                  selectedProject.status
                                ).statusColor,
                                textAlign: "right",
                              }}
                            >
                              {
                                ProjectStatus.status(selectedProject.status)
                                  .statusText
                              }
                            </span>
                          </b>
                        </div>
                      </div>
                      <h2 style={{ color: "gray" }}>{selectedProjCompany}</h2>
                      <div style={{ margin: "36px 0 8px" }}>
                        {selectedProject.tags.map((tag) => {
                          let color = skillColors[tag];
                          return (
                            <Tag key={tag} className="tag-label" color={color}>
                              {tag.replace(/([a-z])([A-Z])/g, "$1 $2")}
                            </Tag>
                          );
                        })}
                      </div>
                      <div
                        className="project-details"
                        style={{
                          display: "flex",
                          gap: 16,
                          alignItems: "center",
                          margin: "24px 0",
                        }}
                      >
                        <div>
                          <div>
                            <h3>Estimated Total Time</h3>
                            <p>
                              {/*
                              Calculate estimated time logic remains the same.
                              */}
                              {Math.floor(Math.random() * 40)} hours / week
                      
                              {/**/}
                            </p>
                          </div>
                        </div>
                        <Divider type="vertical" style={{ marginTop: 10, height: 48 }} />
                        <div>
                          <div>
                            <h3>Timeline</h3>
                            <p>
                              {selectedProject.startDate.replace(
                                /\/\d{4}$/,
                                "/24"
                              )}{" "}
                              -{" "}
                              {selectedProject.endDate.replace(
                                /\/\d{4}$/,
                                "/24"
                              )}
                            </p>
                          </div>
                        </div>
                        <Divider type="vertical" style={{ marginTop: 10, height: 48 }} />
                        <div>
                          <div>
                            <h3>Compensation</h3>
                            <p>${selectedProject.compensation}</p>
                          </div>
                        </div>
                      </div>
                      <div
                        className="project-description"
                        style={{ display: "flex", gap: "16px" }}
                      >
                        <div>
                          <h2>Internship Description</h2>
                          <p>{selectedProject.description}</p>
                        </div>
                      </div>
                      {/* NEW: Recruiters List Block */}
                      <div style={{ marginTop: "20px" }}>
                        <h2>Recruiters</h2>
                        {isLoadingRecruiters ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              height: "200px",
                            }}
                          >
                            <Spin size="large" />
                          </div>
                        ) : displayedRecruiters.length > 0 ? (
                          <List
                            itemLayout="horizontal"
                            dataSource={displayedRecruiters}
                            pagination={{
                              pageSize: 5,
                            }}
                            
                            renderItem={(recruiter) => (
                              <List.Item>
                                <List.Item.Meta
                                  avatar={<Avatar icon={<UserOutlined />} />}
                                  title={
                                    recruiter.firstName && recruiter.lastName
                                      ? `${recruiter.firstName} ${recruiter.lastName}`
                                      : recruiter.email
                                  }
                                  description={
                                    <div>
                                      <div>{recruiter.email}</div>
                                      {recruiter.position && (
                                        <div>Position: {recruiter.position}</div>
                                      )}
                                      <div style={{ marginTop: "8px" }}>
                                        <Button
                                          type="primary"
                                          size="small"
                                          icon={<MailOutlined />}
                                          onClick={() =>
                                            window.open(`mailto:${recruiter.email}`)
                                          }
                                        >
                                          Contact
                                        </Button>
                                      </div>
                                    </div>
                                  }
                                />
                                {recruiter.confidence && (
                                  <Tag
                                    color={
                                      recruiter.confidence > 0.7
                                        ? "green"
                                        : recruiter.confidence > 0.4
                                        ? "blue"
                                        : "orange"
                                    }
                                  >
                                    {Math.round(recruiter.confidence)}% Confident
                                  </Tag>
                                )}
                              </List.Item>
                            )}
                          />
                        ) : (
                          <Empty
                            description="No recruiters found for this company"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                          />
                        )}
                        {/* {!isLoadingRecruiters && (
                          <div style={{ marginTop: "20px", textAlign: "center" }}>
                            <Button
                              type="primary"
                              onClick={() =>
                                selectedCompany && fetchRecruitersForCompany(selectedCompany)
                              }
                            >
                              Refresh Recruiters
                            </Button>
                          </div>
                        )} */}
                      </div>
                      <br></br>
                      <span className="my-auto">
                        <Button
                          style={{
                            marginBottom: 24,
                            color: "white",
                            backgroundColor: "#786AC9",
                            borderRadius: "12px",
                            height: "40px",
                            padding: "8px 16px",
                          }}
                          onClick={() => apply()}
                          disabled={
                            userInfo && userInfo.appliedProjects
                              ? userInfo.appliedProjects.includes(selectedProject.id)
                              : false
                          }
                        >
                          {userInfo && userInfo.appliedProjects
                            ? userInfo.appliedProjects.includes(selectedProject.id)
                              ? "Already Applied"
                              : "Apply"
                            : "Apply"}
                        </Button>
                      </span>
                    </div>
                  </Col>
                  <Col span={5}>
                    <Card>
                      <h3 className="nom">Recommended Companies</h3>
                      <List>
                        {interestCompanies.map((company) => (
                          <List.Item
                            onClick={() => navigate("/companies/" + company.id)}
                          >
                            <List.Item.Meta
                              avatar={<Avatar src={company.imageLink} />}
                              title={company.name}
                              description={company.type}
                            />
                          </List.Item>
                        ))}
                      </List>
                    </Card>
                    <br></br>
                    <Card>
                      <h3 className="nom">Suggested Contacts</h3>
                      <List>
                        {interestPeople.map((person, index) => (
                          <List.Item
                            onClick={() => navigate("/profile/" + person.id)}
                            style={{ cursor: "pointer" }}
                          >
                            <List.Item.Meta
                              avatar={
                                <Avatar
                                  src={
                                    person.imageLink === undefined
                                      ? "https://api.dicebear.com/7.x/miniavs/svg?seed=" + index
                                      : person.imageLink
                                  }
                                />
                              }
                              title={person.name}
                              description={person.major + " @ " + person.school}
                            />
                          </List.Item>
                        ))}
                      </List>
                    </Card>
                  </Col>
                </Row>
              </Content>
            </Layout>
          </Layout>
        </Layout>

        {/* Getting started modal and confetti remain unchanged */}

        {/* Getting started modal */}
        <Modal
          title="Getting Started!"
          open={signup}
          isCompany={isCompany}
          closable={false}
          footer={[]}
        >
          <p style={{ marginBottom: 20 }}>
            Tell us a little bit about yourself to customize your ProjX
            experience!
          </p>
          
          <Form
            layout="vertical"
            style={{ marginBottom: 0 }}
            onFinish={signUpStudent}
          >
            <Form.Item
              label="First Name"
              name="firstName"
              required
              style={{
                width: "75%",
                marginBottom: "10px",
              }}
            >
              <Input
                size="medium"
                placeholder="Enter your first name"
                width={200}
              />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="lastName"
              required
              style={{
                width: "75%",
                marginBottom: "10px",
              }}
            >
              <Input
                size="medium"
                placeholder="Enter your last name"
                width={200}
              />
            </Form.Item>
            <Form.Item
              label="Confirm Email"
              name="email"
              required
              style={{
                width: "75%",
                marginBottom: "10px",
              }}
            >
              <Input
                size="medium"
                placeholder="Enter your login email address"
                width={200}
              />
            </Form.Item>
            <Form.Item
              label="Current School/Institution"
              name="school"
              required
              style={{
                width: "75%",
                marginBottom: "10px",
              }}
            >
              <Input
                size="medium"
                placeholder="Enter your institution"
                width={200}
              />
            </Form.Item>
            <Form.Item
              label="LinkedIn URL"
              name="linkedin"
              style={{
                width: "75%",
                marginBottom: "10px",
              }}
            >
              <Input
                size="medium"
                placeholder="Enter your LinkedIn URL"
                width={200}
              />
            </Form.Item>
            <Form.Item
              label="Interests"
              name="interests"
              required
              style={{
                width: "75%",
                marginBottom: "10px",
              }}
            >
              <Select
                mode="multiple"
                size={"medium"}
                style={{
                  width: "100%",
                  marginBottom: "10px",
                }}
                options={tags}
              />
            </Form.Item>
            <Form.Item
              label="Major"
              name="major"
              required
              style={{
                width: "75%",
                marginBottom: "10px",
              }}
            >
              <Select size="medium" placeholder="Select a major">
                <Option value="Computer Science">Computer Science</Option>
                <Option value="Mechanical Engineering">
                  Mechanical Engineering
                </Option>
                <Option value="Robotics Engineering">
                  Robotics Engineering
                </Option>
                <Option value="Electrical Engineering">
                  Electrical Engineering
                </Option>
                <Option value="Biomedical Engineering">
                  Biomedical Engineering
                </Option>
                <Option value="Chemistry">Chemical Engineering</Option>
                <Option value="Aerospace Engineering">
                  Aerospace Engineering
                </Option>
                <Option value="Civil Engineering">Civil Engineering</Option>
                <Option value="Biology">Biology</Option>
                <Option value="Physics">Physics</Option>
                <Option value="IMGD">IMGD</Option>
                <Option value="Humanities">Humanities</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => {
                  setConfettiOn(true);
                }}
                style={{ marginTop: 28 }}
              >
                Continue
              </Button>
            </Form.Item>
          </Form>
        </Modal>


        <Confetti
          numberOfPieces={confettiOn ? 200 : 0}
          recycle={false}
          wind={0.05}
          gravity={2}
          onConfettiComplete={(confetti) => {
            setConfettiOn(false);
            confetti.reset();
          }}
        />
      </ConfigProvider>
    </>
  );
}

export default Dashboard;
