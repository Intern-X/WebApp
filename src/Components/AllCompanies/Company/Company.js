import {
    Tag,
    Button,
    ConfigProvider,
    Layout,
    Modal,
    Select,
    Form,
    theme,
    Card,
    Row,
    Col,
    Avatar,
    Divider,
    Input,
    InputNumber,
    DatePicker,
    Breadcrumb
} from "antd";
import { HomeOutlined, PlusOutlined } from "@ant-design/icons";
import { BiBulb } from "react-icons/bi";
import Meta from "antd/es/card/Meta.js";
import React, { useState, useEffect, useContext } from "react";
import RequestUtils from "../../../Utils/RequestUtils";
import { useNavigate, useParams } from "react-router-dom";

import "../../Profile/StudentProfile.css";
import dayjs from "dayjs";
import "./Company.css";
import { Tabs } from 'antd';
import { useSelector } from "react-redux";
import tagsJSON from "../../../Utils/tags.json";
import AuthContext from "../../AuthContext/AuthContext";
import { UNAUTHORIZED } from "../../../Utils/UserStates";
import Navbar from "../../../Navbar/Navbar";
import ProjectCard from "../../Project/ProjectCard/ProjectCard";

const { Content } = Layout;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

// JSON DATA
const tags = tagsJSON.tags;
const { TabPane } = Tabs;

function Company() {


    // AUTHENTICATION

    const { userImpl } = useContext(AuthContext);

    let params = useParams();

    // REDUX

    const { allCompanies } = useSelector((state) => state.companies);

    const { refresh } = useSelector((state) => state.status);

    const { loading } = useSelector((state) => state.status);

    const { isCompany } = useSelector((state) => state.userInfo);

    const currentCompany = allCompanies.filter((company) => company.id == params.id)[0];


    // ANTD CONFIG

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();


    // NAVIGATION

    let navigate = useNavigate();

    // SIGNUP COMPANY
        
    let [signup, setSignup] = useState(false);

    const signUpCompany = (values) => {
        const company = {
            name: values.name,
            description: values.description,
            access: [values.email],
            tags: values.tags,
            website: values.website,
            imageLink: values.image,
            projects: [],
            type: values.type,
        }
        RequestUtils.post('/company?id=' + userImpl.uid, company).then((response) => {
            if (response.status == 200) {
                setSignup(false); 
            }
        });
    }

    // CREATE NEW PROJECT MODAL
    let [projectModal, setProjectModal] = useState(false);

    const handleNewProject = (values) => {
        setProjectModal(false);
        const proj = {
            company: params.id,
            title: values.title,
            compensation: values.compensation,
            description: values.description,
            applications: [],
            assignee: "",
            endDate: values.timeline[1].format("MM-DD-YYYY"),
            startDate: values.timeline[0].format("MM-DD-YYYY"),
            status: 1,
            tags: values.tags,
        }
        RequestUtils.post('/project', proj).then((response) => window.location.reload());
    };

    const handleCancel = () => {
        setProjectModal(false);
    };

    // COMPANY INFO
    const companyInfo = [
        {
            icon: <HomeOutlined style={{ marginRight: 13 }} />,
            label: "Website",
            value: <a src={currentCompany.website} style={{ wordWrap: "anywhere" }}>{currentCompany.website}</a>,
        },
        {
            icon: <BiBulb style={{ marginRight: 13 }} />,
            label: "Areas",
            value: currentCompany.tags.join(", "),
        }
    ];


    // CHECK USERIMPL FOR USER
    useEffect(() => {
        if(userImpl == UNAUTHORIZED) {
            navigate("/");
        }
    }, [refresh, navigate])

       
    // RENDER
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#7E70CC",
                },
            }}
        >
            <Layout className="white">
                <Navbar tab={"2"}/>
                <Layout
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
            <Layout
                style={{
                    padding: "24px 100px 24px",
                }}
                className="white"
            >
                <Breadcrumb style={{ margin: "16px 0 32px", }}>
                    {isCompany == undefined ? <></> : isCompany ? <></> : <Breadcrumb.Item><a href="/companies">Back to companies</a></Breadcrumb.Item>}
                   
                </Breadcrumb> 
                <Content
                    style={{
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        display: "flex",
                        justifyContent: "center",
                    }}
                    className="mx-auto"
                >
                    <Row style={{width: "80vw"}}>
                        <Col span={7} style={{ marginRight: "36px" }} >
                            <Card className="profile-card" >
                                <Meta
                                    avatar={
                                        <Avatar
                                            src={currentCompany.imageLink}
                                            size={100}
                                            style={{ marginBottom: "10px"}}
                                        />
                                    }
                                    title={currentCompany.name}
                                    description={currentCompany.type}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        textAlign: "center",
                                    }}
                                />
                                <Divider />

                                <div>
                                    {companyInfo.map((info, index) => (
                                        <div style={{ marginBottom: "5px" }} key={index}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    gap: "1rem"
                                                }}
                                            >
                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                    {info.icon}
                                                    <span style={{ fontWeight: "bold" }}>{info.label}</span>
                                                </div>
                                                <span style={{ marginLeft: 8 }}>{info.value}</span>
                                            </div>
                                        </div>
                                    ))}
                                    <div style={{ margin: "24px 0 4px" }}>
                                        {currentCompany.description}
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col span={16}>
                            <h1 style={{ margin: "0 0 12px" }}>Projects</h1>
                            <Tabs defaultActiveKey="1">
                                <TabPane tab="Applications" key="1">
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        {!isCompany ? <></> :
                                        <Button style={{ marginRight: "16px" }} onClick={() => setProjectModal(true)} >
                                            <PlusOutlined />
                                            New Project
                                        </Button>}
                                    </div>
                                    <br />
                                    <div style={{ display: "flex", flexWrap: "wrap", overflowX: "auto" }}>
                                        {currentCompany.projects.map((project, index) => (
                                            <ProjectCard id={project} companyName={currentCompany.name} status={1} />
                                        ))}
                                    </div>
                                </TabPane>
                                <TabPane tab="Active" key="2">
                                    <div style={{ display: "flex", flexWrap: "wrap", overflowX: "auto" }}>
                                        {currentCompany.projects.map((project, index) => (
                                            <ProjectCard id={project} companyName={currentCompany.name} status={2} />
                                        ))}
                                       
                                    </div>
                                </TabPane>
                                <TabPane tab="Completed" key="3">
                                    <div style={{ display: "flex", flexWrap: "wrap", overflowX: "auto" }}>
                                        {currentCompany.projects.map((project, index) => (
                                            <ProjectCard id={project} companyName={currentCompany.name} status={3} />
                                        ))}
                                    </div>
                                </TabPane>
                            </Tabs>
                        </Col>
                    </Row>

                    {/* NEW PROJECT MODAL */}
                    <Modal title="New Project" type="primary" open={projectModal} footer={[]} onCancel={handleCancel}>
                        <Form
                            layout="vertical"
                            name="basic"
                            className="project_form"
                            autoComplete="off"
                            size="large"
                            onFinish={handleNewProject}
                        >
                            <Form.Item
                                label="Title"
                                name="title"
                                required
                                style={{
                                    marginTop: 0,
                                }}
                                wrapperCol={{
                                    span: 20,
                                }}
                            >
                                <Input
                                    size="large"
                                    className="br-10 my-2"
                                    style={{ width: 300 }}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Description"
                                name="description"
                                required
                                style={{
                                    marginTop: 0,
                                }}
                                wrapperCol={{
                                    span: 20,
                                }}
                            >
                                <TextArea
                                    size="large"
                                    className="br-10 my-2"
                                    style={{ width: 300 }}
                                    autoSize={{ minRows: 3, maxRows: 5 }}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Tags"
                                name="tags"
                                required
                                style={{
                                    width: 300,
                                }}
                            >
                                <Select
                                    mode="multiple"
                                    size={"large"}
                                    style={{
                                        width: "100%",
                                        marginBottom: "10px",
                                    }}
                                    options={tags}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Compensation"
                                name="compensation"
                                required
                                style={{
                                    marginTop: 0,
                                }}
                                wrapperCol={{
                                    span: 20,
                                }}
                            >
                                <InputNumber
                                    size="large"
                                    className="br-10 my-2"
                                    addonAfter="$"
                                    style={{ width: 300 }}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Timeline"
                                name="timeline"
                                style={{
                                    marginTop: 0,
                                }}
                                wrapperCol={{
                                    span: 20,
                                }}
                            >
                                <RangePicker
                                    size="large"
                                    className="br-10 my-2"
                                    addonAfter="$"
                                    style={{ width: 300 }}
                                    id={{
                                        start: 'startInput',
                                        end: 'endInput',
                                    }}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={{ width: 300 }}
                                    size="medium"
                                >
                                    Create Project
                                </Button>
                            </Form.Item>

                        </Form>
                    </Modal>
                </Content>
            </Layout>

            </Content>
                </Layout>
            </Layout>


            {/* NEW COMPANY MODAL */}
            <Modal
                    title="Getting Started!"
                    open={signup && isCompany}
                    isCompany={isCompany}
                    onCancel={() => {
                        setSignup(false);
                    }}
                    footer={[]}
                >
                    <p style={{ marginBottom: 20 }}>
                        Tell us a little bit about yourself to customize your ProjX
                        experience!
                    </p>

                        <Form layout="vertical" style={{ marginBottom: 0 }} onFinish={signUpCompany}>
                            <Form.Item
                                label="Administrator Email"
                                name="email"
                                required
                                style={{
                                    width: "75%",
                                    marginBottom: "10px",
                                }}
                            >
                                <Input
                                    size="medium"
                                    placeholder="Confirm company administrator email"
                                    width={200}
                                ></Input>
                            </Form.Item>
                            <Form.Item
                                label="Company Name"
                                name="name"
                                required
                                style={{
                                    width: "75%",
                                    marginBottom: "10px",
                                }}
                            >
                                <Input
                                    size="medium"
                                    placeholder="Enter company name"
                                    width={200}
                                ></Input>
                            </Form.Item>
                            <Form.Item
                                label="Description"
                                name="description"
                                style={{
                                    width: "75%",
                                    marginBottom: "10px",
                                }}
                                required
                            >
                                <TextArea
                                    size="medium"
                                    placeholder="Enter your description"
                                    width={200}
                                    
                                />
                            </Form.Item>
                            <Form.Item
                                label="Image URL"
                                name="image"
                                style={{
                                    width: "75%",
                                    marginBottom: "10px",
                                }}
                                required
                            >
                                <Input
                                    size="medium"
                                    placeholder="Enter a link to your company logo"
                                    width={200}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Tags"
                                name="tags"
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
                                label="Type"
                                name="type"
                                required
                                style={{
                                    width: "75%",
                                    marginBottom: "10px",
                                }}
                            >
                                <Input
                                    size="medium"
                                    placeholder="Enter a company type"
                                    width={200}
                                />
                                
                            </Form.Item>
                            <Form.Item
                                label="Website"
                                name="website"
                                required
                                style={{
                                    width: "75%",
                                    marginBottom: "10px",
                                }}
                            >
                                <Input
                                    size="medium"
                                    placeholder="Enter a company website"
                                    width={200}
                                    required
                                />
                                
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                >
                                    Continue
                                </Button>
                            </Form.Item>
                        </Form>
                </Modal>
        </ConfigProvider>

    );
}

export default Company;