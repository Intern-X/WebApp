import {
    BellOutlined,
    UserOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, Modal } from "antd";
import { BiBuildingHouse, BiSolidCity } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useContext, useState } from "react";
import { logout } from "../Firebase";
import { useDispatch, useSelector } from "react-redux";
import AuthContext from "../Components/AuthContext/AuthContext";
import { resetCompanies } from "../redux/slices/companies";
import { resetProjects } from "../redux/slices/projects";
import { resetStudents } from "../redux/slices/students";
import { resetUserInfo } from "../redux/slices/userInfo";
const { Header } = Layout;


function Navbar(props) {

    // CONFIGURATION

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const { userImpl } = useContext(AuthContext);

    const [notifsOpen, setNotifsOpen] = useState(false);

    // HANDLE LOGOUT
    const handleLogout = () => {
        dispatch(resetCompanies());
        dispatch(resetProjects());
        dispatch(resetStudents());
        dispatch(resetUserInfo());
        logout();
        navigate("/");
      };

    // REDUX

    const { isCompany } = useSelector((state) => state.userInfo);

    // MENU ITEMS

    const studentItems = [
        {
            key: "1",
            icon: <BiBuildingHouse />,
            title: "Home",
            label: "Home",
            onClick: () => {
                navigate("/dashboard");
            },
        },
        {
            key: "2",
            icon: <BiSolidCity />,
            title: "Companies",
            label: "Companies",
            onClick: () => {
                navigate("/companies");
            },
        },
        {
            key: "3",
            icon: <UserOutlined />,
            title: "Alumni & Recruiters",
            label: "Alumni & Recruiters",
            onClick: () => {
                navigate("/alumni-recruiters");
            },
        },
    ];
    
    const companyItems = [
        {
            key: "1",
            icon: <BiBuildingHouse />,
            title: "Home",
            label: "Home",
            onClick: () => {
                navigate("/companies/" + userImpl.uid);
            },
        },
        {
            key: "2",
            icon: <UserOutlined />,
            title: "Alumni & Recruiters",
            label: "Alumni & Recruiters",
            onClick: () => {
                navigate("/alumni-recruiters");
            },
        },
    ];

    // RENDER
    return (
        <Header
            style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#1f1f1f",
            }}
        >
            <div className="demo-logo" />
            <Menu
                theme="light"
                mode="horizontal"
                defaultSelectedKeys={[props.tab != undefined ? props.tab : "0"]}
                items={!isCompany ? studentItems : companyItems}
                style={{
                    flex: 1,
                    minWidth: 0,
                    fontSize: "16px",
                }}
            />
            
            {isCompany ? <></> :
            <>
            <Button className="nobg"
                // onClick={() => navigate("/notifications")}
                style={{ marginRight: "25px" }}
                onClick={() => setNotifsOpen(true)}
            >
                <BellOutlined style={{ fontSize: "20px", color: "white" }} />
            </Button>
            <Button onClick={() => {
                isCompany ? navigate("/companies/" + userImpl.uid) : navigate("/profile/" + userImpl.uid);
            }} className="nobg">
                <UserOutlined style={{ fontSize: "20px", color: "white", marginRight: "25px" }} />
            </Button>
            
            </>}
            <Button onClick={() => handleLogout()} className="nobg">
                <LogoutOutlined style={{ fontSize: "20px", color: "white", }} />
            </Button>
            <Modal title="Notifications" open={notifsOpen} onOk={() => setNotifsOpen(false)} onCancel={() => setNotifsOpen(false)}>
                <p>You have no notifications. Have a beautiful day!</p>
            </Modal>
        </Header>
    );
}

export default Navbar;