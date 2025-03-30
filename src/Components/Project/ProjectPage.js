import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ConfigProvider,
  Layout,
  theme,
  Card,
  Row,
  Col,
  Tag,
  List,
  Avatar,
  Button,
} from "antd";
import { Breadcrumb, Divider } from "antd";
import RequestUtils from "../../Utils/RequestUtils.js";
import Navbar from "../../Navbar/Navbar.js";
import { Content } from "antd/es/layout/layout.js";
import "./ProjectPage.css";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import { useDispatch, useSelector } from "react-redux";
import AuthContext from "../AuthContext/AuthContext.js";
import { UNAUTHORIZED } from "../../Utils/UserStates.js";
import { toggleRefresh } from "../../redux/slices/status.js";
import ProjectStatus from "../../Utils/ProjectStatus.js";

function ProjectPage() {

  // CONFIGURATION

  const params = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { userImpl } = useContext(AuthContext);

  // REDUX

  const { allProjects } = useSelector((state) => state.projects);

  const { allCompanies } = useSelector((state) => state.companies);

  const { allStudents } = useSelector((state) => state.students);

  const currentProject = allProjects.filter(
    (project) => project.id === params.id
  )[0];

  const currentCompany = allCompanies.filter(
    (company) => company.id === currentProject.company
  )[0];

  const { isCompany } = useSelector((state) => state.userInfo);

  const { userInfo } = useSelector((state) => state.userInfo);

  const { refresh } = useSelector((state) => state.status);

  // THEME

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // CONSTS

  const colors = ["success", "processing", "error", "warning", "default"];
  const actualColors = ["#52c41a", "#1890ff", "#f5222d", "#faad14", "#d9d9d9"];

  // USESTATES

  const [studentsApplied, setStudentsApplied] = useState([]);

  // CONFETTI COMPONENT

  const [confettiOn, setConfettiOn] = useState(false);
  const { width, height } = useWindowSize();
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

  // CALCULATE PROJECT TIME IN HOURS

  const calculateEstimatedTime = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) * 1.3;
    const randomizedDiffDays =
      diffDays +
      Math.floor(Math.random() * (diffDays * 0.2) * 2) -
      Math.floor(diffDays * 0.2);
    return Math.floor(randomizedDiffDays);
  };

  // APPLY TO PROJECT

  const apply = () => {
    RequestUtils.post("/application", {
      studentId: userImpl.uid,
      projectId: params.id,
    }).then((response) => {
      setConfettiOn(true);
      console.log(response.status);
    });
    dispatch(toggleRefresh());
  };

  // ASSIGN STUDENT TO PROJECT

  const assign = (id) => {
    RequestUtils.post("/assignProject", {
      studentId: id,
      projectId: params.id,
    }).then((response) => {
      setConfettiOn(true);
    });
    dispatch(toggleRefresh());
  };

  // CHECK IF USER IS LOGGED IN

  useEffect(() => {
    if (userImpl == UNAUTHORIZED) {
      navigate("/");
    }
  }, [refresh, navigate]);

  // CHECK STUDENTS APPLIED TO PROJECT

  useEffect(() => {
    if (currentProject.applications !== undefined) {
      const newStudentsApplied = [];
      let studentList = [];
      for (let i = 0; i < currentProject.applications.length; i++) {
        let student = allStudents.filter(
          (student) => student.id === currentProject.applications[i]
        )[0];
        let modifiedStudent = {
          id: student.id,
          name: student.name,
          school: student.school,
          major: student.major,
        };
        studentList.push(modifiedStudent);
      }
      setStudentsApplied(studentList);
    }
  }, [currentProject]);

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
        <Navbar tab={"2"} />
        <Layout className="white" style={{ padding: "24px 100px 24px" }}>
          <Breadcrumb style={{ margin: "16px 0 16px" }}>
            {currentCompany != null && (
              <Breadcrumb.Item>
                <a href={"/companies/" + currentProject.company}>
                  {currentCompany.name != null
                    ? "Back to " + currentCompany.name
                    : "Back to Company"}
                </a>
              </Breadcrumb.Item>
            )}
          </Breadcrumb>
          <Content
            style={{
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
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
                  <span>{currentProject.title}</span>
                </h1>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <b>
                    <span
                      style={{
                        color: ProjectStatus.status(currentProject.status)
                          .statusColor,
                        marginRight: "8px",
                        fontSize: "18px",
                      }}
                    >
                      &bull;
                    </span>
                    <span
                      style={{
                        color: ProjectStatus.status(currentProject.status)
                          .statusColor,
                      }}
                    >
                      {ProjectStatus.status(currentProject.status).statusText}
                    </span>
                  </b>
                </div>
              </div>
              <h2 style={{ color: "gray", marginTop: 12 }}>
                {currentCompany == null ? "" : currentCompany.name}
              </h2>
              <div style={{ margin: "24px 0 8px" }}>
                {currentProject.tags !== undefined ? (
                  currentProject.tags
                    .sort((a, b) => {
                      if (userInfo.tags === undefined) return 0;
                      else
                        return userInfo.tags.includes(a)
                          ? -1
                          : userInfo.tags.includes(b)
                          ? 1
                          : 0;
                    })
                    .map((tag) => {
                      const colorIndex = Math.floor(
                        Math.random() * colors.length
                      );
                      let color = colors[colorIndex];
                      return (
                        <Tag
                          key={tag}
                          className="tag-label"
                          color={color}
                          style={{
                            borderRadius: "10px",
                            boxShadow:
                              userInfo.tags !== undefined &&
                              userInfo.tags.includes(tag)
                                ? "0 0 5px rgba(0, 0, 0, 0.5)"
                                : "none",
                            border:
                              userInfo.tags !== undefined &&
                              userInfo.tags.includes(tag)
                                ? `2.5px solid ${actualColors[colorIndex]}`
                                : "",
                          }}
                        >
                          {tag.replace(/([A-Z])/g, " $1")}
                        </Tag>
                      );
                    })
                ) : (
                  <></>
                )}
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
                    <h2>Estimated Time</h2>
                    <p>
                      {calculateEstimatedTime(
                        currentProject.startDate,
                        currentProject.endDate
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
                    <h2>Timeline</h2>
                    <p>
                      {currentProject.startDate !== undefined &&
                      currentProject.endDate !== undefined ? (
                        currentProject.startDate.replace(/\/\d{4}$/, "/24") +
                        " to " +
                        currentProject.endDate.replace(/\/\d{4}$/, "/24")
                      ) : (
                        <></>
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
                    <h2>Compensation</h2>
                    <p>${currentProject.compensation}</p>
                  </div>
                </div>
              </div>
              {isCompany || currentProject.status !== 1 ? (
                <></>
              ) : (
                <Button
                  style={{
                    marginBottom: 24,
                    color: "white",
                    backgroundColor: "#786AC9",
                    borderRadius: "12px",
                    width: "80px",
                    height: "40px",
                    padding: "8px 16px",
                  }}
                  onClick={() => {
                    apply();
                  }}
                >
                  Apply
                </Button>
              )}
              <div
                className="project-description"
                style={{ display: "flex", gap: "16px" }}
              >
                <div>
                  <h2>Project Description</h2>
                  <p>{currentProject.description}</p>
                </div>
              </div>


              
              <div
                className="project-description"
                style={{ display: "flex", gap: "16px", width: "100%" }}
              >
                {userImpl != null &&
                userImpl.uid === currentProject.company &&
                currentProject.status === 1 ? (
                  <div style={{ width: "100%" }}>
                    <h2>Student Applicants</h2>
                    <Row>
                      {currentProject.applications !== undefined &&
                        studentsApplied.map((student, index) => {
                          return (
                            <Col
                              span={4}
                              onClick={() => navigate("/profile/" + student.id)}
                              style={{ cursor: "grabbing!important" }}
                            >
                              <Card className="mx-2">
                                <List.Item.Meta
                                  avatar={
                                    <Avatar
                                      src={
                                        "https://api.dicebear.com/7.x/miniavs/svg?seed=" +
                                        student.id
                                      }
                                    />
                                  }
                                  title={student.name}
                                  description={
                                    student.major + " @ " + student.school
                                  }
                                  key={index}
                                />

                                <Button
                                  style={{
                                    marginTop: 12,
                                    color: "white",
                                    backgroundColor: "#786AC9",
                                    borderRadius: "12px",
                                    width: "80px",
                                    height: "40px",
                                    padding: "8px 16px",
                                  }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    assign(student.id);
                                  }}
                                >
                                  Choose
                                </Button>
                              </Card>
                            </Col>
                          );
                        })}
                    </Row>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
      <ConfettiMode
        confettiOn={confettiOn}
        setConfettiOn={setConfettiOn}
        width={width}
        height={height}
      ></ConfettiMode>
    </ConfigProvider>
  );
}

export default ProjectPage;
