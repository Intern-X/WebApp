import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import { ConfigProvider, Layout, theme, Card, Row, Col, Avatar } from "antd";
import {
  MailOutlined,
  BookOutlined,
  LinkedinOutlined,
  CalendarFilled,
  StarOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import Meta from "antd/es/card/Meta.js";
import { Content } from "antd/es/layout/layout.js";
import { Divider } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import "./StudentProfile.css";
import { BiBulb } from "react-icons/bi";
import { useSelector } from "react-redux";
import AuthContext from "../AuthContext/AuthContext";
import { UNAUTHORIZED } from "../../Utils/UserStates";
import Navbar from "../../Navbar/Navbar";
import RequestUtils from "../../Utils/RequestUtils";

function StudentProfile() {
  // CONFIGURATION
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  let navigate = useNavigate();

  // REDUX AND AUTH

  const { userImpl } = useContext(AuthContext);

  const { refresh } = useSelector((state) => state.status);

  const { userInfo } = useSelector((state) => state.userInfo);

  const { allProjects } = useSelector((state) => state.projects);

  // USESTATE

  let [myProjects, setMyProjects] = useState([]);
  let [pastProjects, setPastProjects] = useState([]);
  let [student, setStudent] = useState({});

  // PROFILE INFO
  const profileInfo = [
    {
      icon: <EnvironmentOutlined style={{ marginRight: 13 }} />,
      label: "School",
      value: student.school,
    },
    {
      icon: <MailOutlined style={{ marginRight: 13 }} />,
      label: "Email",
      value: student.email,
    },
    {
      icon: <ReadOutlined style={{ marginRight: 13 }} />,
      label: "GPA",
      value: student.gpa,
    },
    {
      icon: <BookOutlined style={{ marginRight: 13 }} />,
      label: "Major",
      value: student.major,
    },
    {
      icon: <LinkedinOutlined style={{ marginRight: 13 }} />,
      label: "LinkedIn",
      value: (
        <a href={"https://www.linkedin.com/in/" + student.linkedin}>
          {student.linkedin}
        </a>
      ),
    },
    {
      icon: <CalendarFilled style={{ marginRight: 13 }} />,
      label: "Y.O.E",
      value: Math.floor(Math.random() * 10) + 1 + " years",
    },
    {
      icon: <StarOutlined style={{ marginRight: 13 }} />,
      label: "Quality Points",
      value: Math.floor(Math.random() * 5) + 1,
    },
    {
      icon: <BiBulb style={{ marginRight: 13 }} />,
      label: "Interests",
      value: userInfo.tags.join(", "),
    },
  ];

  // PARAMS FROM URL
  const { id } = useParams();

  // GET STUDENT PROJECTS FOR STUDENT
  useEffect(() => {
    
    RequestUtils.get('/student?id=' + id).then((response) => response.json())
    .then((data) => {
      if (data.status === 200) {
        setStudent(data.data);
      }
    })

    
    if (userImpl) {
      let projectList = student.projects;
      let studentCurrentProjects = [];
      let studentPastProjects = [];

      for (let i = 0; i < allProjects.length; i++) {
        let project = allProjects[i];
        if (projectList && projectList.includes(project.id)) {
          if (project.status == 2) studentCurrentProjects.push(project);
          if (project.status == 3) studentPastProjects.push(project);
        }
      }

      setMyProjects(studentCurrentProjects);
      setPastProjects(studentPastProjects);
    }
  }, [refresh, navigate]);

  // CHECK IF USER IS AUTHORIZED

  useEffect(() => {
    if (userImpl == UNAUTHORIZED) {
      navigate("/");
    }
  }, [refresh, navigate]);

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
        <Navbar tab={"0"} />
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
              display: "flex",
              justifyContent: "center",
            }}
            className="mx-auto"
          >
            <Layout className="white">
              <Content
                style={{
                  margin: 0,
                  minHeight: 280,
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                  display: "flex",
                  justifyContent: "center",
                }}
                className="mx-auto"
              >
                <Row style={{ marginTop: "32px" }}>
                  <Col span={8} style={{ marginRight: "20px" }}>
                    <Card className="profile-card fh">
                      <Meta
                        avatar={
                          <Avatar
                            src={
                              "https://api.dicebear.com/7.x/initials/svg?seed=" + (student.name ?
                              student.name.charAt(0) +
                              student.name.split(" ")[1].charAt(0) : "n/a")
                            }
                            size={100}
                          />
                        }
                        title={
                          student && student.name ?
                          student.name.split(" ")[0] +
                          " " +
                          student.name.split(" ")[1] :
                          "N/A"
                        }
                        description={"Student"}
                        style={{
                          display: "flex",

                          alignItems: "center",
                          textAlign: "center",
                        }}
                      />
                      <Divider />

                      <div>
                        {profileInfo.map((info, index) => (
                          <div style={{ marginBottom: "5px" }} key={index}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                alignContent: "end!important",
                                gap: "1rem",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {info.icon}
                                <span style={{ fontWeight: "bold" }}>
                                  {info.label}
                                </span>
                              </div>
                              {index != 6 ? (
                                <span style={{ marginLeft: 8, float: "right" }}>
                                  {info.value}
                                </span>
                              ) : (
                                <></>
                              )}
                            </div>

                            {index == 6 ? (
                              <p style={{ marginLeft: 15 }}>{info.value}</p>
                            ) : (
                              <></>
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>
                  </Col>
                  <Col className="my-projects nol mx-3" span={7}>
                    <h2 className="nom">Current Projects</h2>
                    <br></br>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        overflowX: "auto",
                      }}
                    >
                      {myProjects.map((project, index) => (
                        <Card
                          key={project.title}
                          style={{ marginBottom: 16, marginRight: 16 }}
                        >
                          <Meta
                            title={project.title}
                            description={"ProjX-ID " + project.id}
                          />
                          <div style={{ marginTop: 24 }}>
                            <b>Description:</b> {project.description}
                          </div>
                          <div>
                            <b>Skills:</b> {project.tags.join(", ")}
                          </div>
                          <div>
                            <b>Compensation:</b> {project.compensation}
                          </div>
                          <div>
                            <b>Status:</b>{" "}
                            {project.status == 1
                              ? "Looking for applicants"
                              : project.status == 2
                              ? "Project in progress"
                              : "Finished"}
                          </div>
                          <div>
                            <a href={""}>Project Demo</a>
                          </div>
                        </Card>
                      ))}
                      {myProjects.length == 0 ? (
                        <div>
                          <h3 style={{ fontWeight: "normal" }}>
                            No projects found for the selected user
                          </h3>
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </Col>
                  <Col className="my-projects nol mx-2" span={7}>
                    <h2 className="nom">Past Projects</h2>
                    <br></br>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        overflowX: "auto",
                      }}
                    >
                      {pastProjects.map((project, index) => (
                        <Card
                          key={project.title}
                          style={{ marginBottom: 16, marginRight: 16 }}
                        >
                          <Meta
                            title={project.title}
                            description={"ProjX-ID " + project.id}
                          />
                          <div style={{ marginTop: 24 }}>
                            <b>Description:</b> {project.description}
                          </div>
                          <div>
                            <b>Skills:</b> {project.tags.join(", ")}
                          </div>
                          <div>
                            <b>Compensation:</b> {project.compensation}
                          </div>
                          <div>
                            <b>Status:</b>{" "}
                            {project.status == 1
                              ? "Looking for applicants"
                              : project.status == 2
                              ? "Project in progress"
                              : "Finished"}
                          </div>
                          <div>
                            <a href={""}>Project Demo</a>
                          </div>
                        </Card>
                      ))}
                      {pastProjects.length == 0 ? (
                        <div>
                          <h3 style={{ fontWeight: "normal" }}>
                            No projects found for the selected user
                          </h3>
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </Col>
                </Row>
              </Content>
            </Layout>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default StudentProfile;
