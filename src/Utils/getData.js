import RequestUtils from "./RequestUtils";

class RefreshData {
    static async refreshData(user, requests) {

        const uid = user.uid;

        return Promise.all([
            // company information
            RequestUtils.get("/allCompanies").then((response) => response.json())
                .then((data) => {
                    if (data.status === 200) {
                        return data.data;
                    }
                }),

            // projects information
            RequestUtils.get("/allProjects").then((response) => response.json())
                .then((data) => {
                    if (data.status === 200) {
                        return data.data;
                    }
                }),

            // user info
            RequestUtils.isCompany(user.uid).then((result) => result),

            RequestUtils.get("/student?id=" + user.uid)
                .then((response) => response.json())
                .then((data) => {
                    if (data.status === 200) {
                        return data.data;
                    }
                }),

            // students info
            RequestUtils.get("/allStudents").then((response) => response.json())
                .then((data) => {
                    if (data.status === 200) {
                        return data.data;
                    }
                }),

        ])
            .then((values) => {
                console.log(user.uid);
                return [
                    // companies
                    values[0],

                    // projects
                    values[1],

                    // company check
                    values[2],

                    // user
                    
                    values[3],

                    // students
                    values[4],
                ];
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
    }
}

export default RefreshData;