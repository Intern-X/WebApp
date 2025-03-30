import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";

import {
  ConfigProvider,
  Layout,
  theme,
  Card,
  Row,
  Avatar,
  Skeleton,
  Tag,
  Space,
} from "antd";
import Meta from "antd/es/card/Meta.js";
import Navbar from "../../Navbar/Navbar.js";
import { Content } from "antd/es/layout/layout.js";
import { useSelector } from "react-redux";
import "./AllCompanies.css";
import AuthContext from "../AuthContext/AuthContext.js";
import { UNAUTHORIZED } from "../../Utils/UserStates.js";

function AllCompanies() {
  // REDUX

  const { allCompanies } = useSelector((state) => state.companies);

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

  // LOADING CARDS

  const loadingCards = [
    {
      name: <Skeleton active />,
      id: "",
      image: "",
      content: "",
      tags: [],
    },
    {
      name: <Skeleton active />,
      id: "",
      image: "",
      content: "",
      tags: [],
    },
    {
      name: <Skeleton active />,
      id: "",
      image: "",
      content: "",
      tags: [],
    },
    {
      name: <Skeleton active />,
      id: "",
      image: "",
      content: "",
      tags: [],
    },
    {
      name: <Skeleton active />,
      id: "",
      image: "",
      content: "",
      tags: [],
    },
    {
      name: <Skeleton active />,
      id: "",
      image: "",
      content: "",
      tags: [],
    },
    {
      name: <Skeleton active />,
      id: "",
      image: "",
      content: "",
      tags: [],
    },
    {
      name: <Skeleton active />,
      id: "",
      image: "",
      content: "",
      tags: [],
    },
    {
      name: <Skeleton active />,
      id: "",
      image: "",
      content: "",
      tags: [],
    },
    {
      name: <Skeleton active />,
      id: "",
      image: "",
      content: "",
      tags: [],
    },
    {
      name: <Skeleton active />,
      id: "",
      image: "",
      content: "",
      tags: [],
    },
    {
      name: <Skeleton active />,
      id: "",
      image: "",
      content: "",
      tags: [],
    },
  ];

  // REDIRECT TO LOGIN IF NOT AUTHENTICATED
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
        <Navbar tab={"2"} />
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
                <h1>Companies</h1>
                <h3 style={{ fontWeight: "normal" }}>
                  Navigating the job market can be difficult, but ProjX
                  coordinates with the top companies to deliver high-quality
                  projects to kickstart your career.
                </h3>
                <h3 style={{ fontWeight: "normal" }}>
                  From software development to consulting, the following
                  companies are excited to support you through project-based
                  experiences and boost your portfolio! 🚀
                </h3>
              </div>
              <div className="mx-auto">
                <Row>
                  <div className="mt-2"></div>
                  {(loading ? loadingCards : allCompanies).map((card) => {
                    return (
                      <Card
                        style={{ width: 300, margin: "1rem" }}
                        className="card1, glow"
                        onClick={() => {
                          navigate("/companies/" + card.id);
                        }}
                      >
                        <Meta
                          avatar={
                            <Avatar
                              shape="square"
                              src={card.imageLink}
                              size={50}
                              style={{
                                marginRight: "15px",
                              }}
                            />
                          }
                          title={card.name}
                          description={card.type}
                          style={{ marginBottom: 20 }}
                        />
                        <Space size={[0, 8]} wrap>
                          {card.tags.map((tag) => {
                            let color =
                              colors[Math.floor(Math.random() * colors.length)];
                            return <Tag color={color}>{tag}</Tag>;
                          })}
                        </Space>
                      </Card>
                    );
                  })}
                </Row>
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default AllCompanies;
