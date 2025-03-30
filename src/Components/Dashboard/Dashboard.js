// THIS IS THE OLD FILE


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
} from "antd";
import { message } from "antd";
import {
  CalendarOutlined,
  CheckCircleFilled,
  DollarCircleOutlined,
} from "@ant-design/icons";

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

  // SKELETON LOADING
  const loadingList = [
    {
      title: <Skeleton active />,
      description: <Skeleton active />,
      avatar: <Skeleton.Avatar avatar />,
    },
    {
      title: <Skeleton active />,
      description: <Skeleton active />,
      avatar: <Skeleton.Avatar avatar />,
    },
    {
      title: <Skeleton active />,
      description: <Skeleton active />,
      avatar: <Skeleton.Avatar avatar />,
    },
    {
      title: <Skeleton active />,
      description: <Skeleton active />,
      avatar: <Skeleton.Avatar avatar />,
    },
  ];

  // SIGNUP MODAL

  let [signup, setSignup] = useState(false);

  // PROJECT DETAILS
  let [projectIndex, setProjectIndex] = useState(0);
  let [selectedProjCompany, setSelectedProjCompany] = useState("");
  let [selectedProject, setSelectedProject] = useState({
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

  // INTERESTS AND NAME
  let [interestCompanies, setInterestCompanies] = useState([]);
  let [interestPeople, setInterestPeople] = useState([]);
  let [name, setName] = useState("");

  // REACT CONFETTI
  let [confettiOn, setConfettiOn] = useState(false);

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

  /**
   * Calculates differece in hours between two dates
   * @param {String} startDate - start date
   * @param {String} endDate - end date
   * @returns {Number} - difference in hours
   */
  const calculateEstimatedTime = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) * 1.3;
    return Math.floor(diffDays);
  };

  /**
   * Applies a user for a job
   * @returns {Number} - N/A
   */
  const apply = () => {
    let reqObj = {
      studentId: userImpl.uid,
      projectId: selectedProject.id,
    };
    RequestUtils.post("/application", reqObj)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          success();
        }
        if (data.status === 400) {
          applicationError();
        } else if (data.status === 404) {
          softwareError();
        }
      });
  };

  /**
   * Turns on confetti
   * @param {Boolean} confettiOn - confetti on
   * @param {Function} setConfettiOn - set confetti on
   * @returns {Component} - confetti component
   */
  const ConfettiMode = ({ confettiOn, setConfettiOn }) => {
    return (
      <div>
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
      </div>
    );
  };

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

  // GET PROJECT DETAILS
  useEffect(() => {
    // Edge case where there is no project at index
    if (allProjects[projectIndex] === undefined) return;

    // Retrieve project details
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

    // Retrieve company details
    let company = allCompanies.filter(
      (company) => company.id === allProjects[projectIndex].company
    )[0];
    setSelectedProjCompany(company.name);
  }, [projectIndex]);

  // GET RELEVANT COMPANIES AND STUDENTS
  useEffect(() => {
    if (userImpl == null) {
      return;
    }
    if (userInfo == null) {
      setSignup(true);
    }
    else if (userInfo.major?.length == undefined || userInfo.major?.length == 0)
      setSignup(true);
    else {
      setSignup(false);
      RequestUtils.get(
        "/relevantCompanies?tags=" + JSON.stringify(userInfo.tags)
      )
        .then((response) => {
          return response.json();
        })
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
                        "! Get started on kickstarting your career with Proj-X!"}
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
                      dataSource={loading ? loadingList : allProjects}
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
                              key="list-vertical-star-o"
                            />,
                            <IconText
                              icon={CheckCircleFilled}
                              text={item.status === 1 ? "Open" : "Closed"}
                              key="list-vertical-like-o"
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
                              key="list-vertical-message"
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
                          {item.content}
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
                            alignContent: "end!important",
                            alignItems: "flex-end",
                            width: "290px",
                            margin: "0px!important",
                            padding: "0px!important",
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
                              {calculateEstimatedTime(
                                selectedProject.startDate,
                                selectedProject.endDate
                              )}{" "}
                              hours
                            </p>
                          </div>
                        </div>
                        <Divider
                          type="vertical"
                          style={{ marginTop: 10, height: 48 }}
                        />
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
                        <Divider
                          type="vertical"
                          style={{ marginTop: 10, height: 48 }}
                        />
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
                          <h2>Project Description</h2>
                          <p>{selectedProject.description}</p>
                        </div>
                      </div>
                      <br></br>
                      <span
                        style={{
                          marginTop: "auto!important",
                          marginBottom: "auto!important",
                        }}
                        className="my-auto"
                      >
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
                          disabled={userInfo && userInfo.appliedProjects
                            ? userInfo.appliedProjects.includes(
                                selectedProject.id
                              ) : false}
                        >
                          {userInfo && userInfo.appliedProjects
                            ? userInfo.appliedProjects.includes(
                                selectedProject.id
                              )
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
                        {interestCompanies.map((company) => {
                          return (
                            <List.Item
                              onClick={() =>
                                navigate("/companies/" + company.id)
                              }
                            >
                              <List.Item.Meta
                                avatar={<Avatar src={company.imageLink} />}
                                title={company.name}
                                description={
                                  company.type
                                  // (company.projects.filter(proj => proj.status === 1).length) + " Projects Available"
                                  // company.available
                                  //     ? "Projects Available"
                                  //     : "Not Available"
                                }
                              />
                            </List.Item>
                          );
                        })}
                      </List>
                    </Card>
                    <br></br>
                    <Card>
                      <h3 className="nom">Suggested Contacts</h3>
                      <List>
                        {interestPeople.map((person, index) => {
                          return (
                            <List.Item
                              onClick={() => navigate("/profile/" + person.id)}
                              style={{ cursor: "grabbing!important" }}
                            >
                              <List.Item.Meta
                                avatar={
                                  <Avatar
                                    src={
                                      person.imageLink == undefined
                                        ? "https://api.dicebear.com/7.x/miniavs/svg?seed=" +
                                          index
                                        : person.imageLink
                                    }
                                  />
                                }
                                title={person.name}
                                description={
                                  person.major + " @ " + person.school
                                }
                              />
                            </List.Item>
                          );
                        })}
                      </List>
                    </Card>
                  </Col>
                </Row>
              </Content>
            </Layout>
          </Layout>
        </Layout>

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
              label="GPA"
              name="gpa"
              required
              style={{
                width: "10%",
                marginBottom: "10px",
              }}
            >
              <Input
                size="medium"
                width={100}
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

        <ConfettiMode
          confettiOn={confettiOn}
          setConfettiOn={setConfettiOn}
        ></ConfettiMode>
      </ConfigProvider>
    </>
  );
}

export default Dashboard;
