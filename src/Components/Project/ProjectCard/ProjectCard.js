import { Card, Space } from "antd";
import {
  CalendarOutlined,
  CheckCircleFilled,
  DollarCircleOutlined,
} from "@ant-design/icons";
import Meta from "antd/es/card/Meta.js";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProjectCard.css";
import { useSelector } from "react-redux";

function ProjectCard({ id, companyName, status }) {
  const { allProjects } = useSelector((state) => state.projects);

  const currentProject = allProjects.filter((project) => project.id === id)[0];

  const navigate = useNavigate();

  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

  return status !== undefined && currentProject.status !== status ? (
    <></>
  ) : (
    <Card
      key={currentProject.title}
      style={{ marginBottom: 16, marginRight: 16, cursor: "pointer" }}
      onClick={() => navigate("/projects/" + id)}
      className="glow"
      actions={[
        <IconText
          icon={DollarCircleOutlined}
          text={currentProject.compensation}
          key="list-vertical-star-o"
        />,
        <IconText
          icon={CheckCircleFilled}
          text={currentProject.status == 1 ? "Open" : "Closed"}
          key="list-vertical-like-o"
        />,
        <IconText
          icon={CalendarOutlined}
          text={
            currentProject.startDate.substring(
              0,
              currentProject.startDate.length - 5
            ) +
            " - " +
            currentProject.endDate.substring(
              0,
              currentProject.endDate.length - 5
            )
          }
          key="list-vertical-message"
        />,
      ]}
    >
      <Meta
        title={currentProject.title}
        description={companyName}
        style={{ whiteSpace: "wrap" }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div style={{ marginTop: 24 }}>{currentProject.description}</div>
        <div>
          <b>Skills</b>{" "}
          {currentProject.tags === undefined
            ? ""
            : currentProject.tags
                .map((tag) => tag.replace(/([a-z])([A-Z])/g, "$1 $2"))
                .join(", ")}
        </div>
      </div>
    </Card>
  );
}

export default ProjectCard;
