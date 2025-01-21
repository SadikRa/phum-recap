import { Button, Dropdown, Table, TableColumnsType, Tag } from "antd";
import { TSemester } from "../../../types";
import { useGetAllRegisteredSemestersQuery, useUpdateRegisteredSemesterMutation } from "../../../redux/features/admin/courseManagement";
import moment from "moment";
import { useState } from "react";
export type TTableData = Pick<TSemester, "startDate" | "endDate" | "status">;

const items = [
  { key: "UPCOMING", label: "Upcoming" },
  { key: "ONGOING", label: "Ongoing" },
  { key: "ENDED", label: "Ended" },
];

const RegisteredSemesters = () => {
  const [semesterId, setSemesterId] = useState("");
  console.log(semesterId);

  const { data: semesterData, isFetching } =
    useGetAllRegisteredSemestersQuery(undefined);

  const [updateSemesterStatus] = useUpdateRegisteredSemesterMutation()


  const tableData = semesterData?.data?.map(
    ({ _id, academicSemester, startDate, endDate, status }) => ({
      key: _id,
      name: `${academicSemester.name}`,
      startDate: moment(new Date(startDate)).format("DD MMMM YY"),
      endDate: moment(new Date(endDate)).format("DD MMMM YY"),
      status,
    })
  );


  const handleStatusDropdown = (data) => {

    const updateData = {
      id: semesterId,
      data: {status: data.key}
    }

    updateSemesterStatus(updateData)
  };

  const menuProps = {
    items,
    onClick: handleStatusDropdown,
  };

  const columns: TableColumnsType<TTableData> = [
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (item) => {
        let color;
        if (item == "ONGOING") {
          color = "green";
        } else if (item == "ENDED") {
          color = "red";
        } else if (item == "UPCOMING") {
          color = "blue";
        }
        return <Tag color={color}> {item}</Tag>;
      },
    },
    {
      title: "Start Date",
      key: "startDate",
      dataIndex: "startDate",
    },
    {
      title: "End Date",
      key: "endDate",
      dataIndex: "endDate",
    },
    {
      title: "Action",
      key: "x",
      render: (item) => {
        return (
          <Dropdown menu={menuProps} trigger={["click"]}>
            <Button onClick={() => setSemesterId(item.key)}>Update</Button>
          </Dropdown>
        );
      },
    },
  ];

  // const onChange: TableProps<TTableData>["onChange"] = (
  //   _pagination,
  //   filters,
  //   _sorter,
  //   extra
  // ) => {
  //   if (extra.action === "filter") {
  //     const queryParams: TQueryParam[] = [];
  //     setParams(queryParams);
  //   }
  // };

  return (
    <Table
      loading={isFetching}
      columns={columns}
      dataSource={tableData}
      // onChange={onChange}
    />
  );
};

export default RegisteredSemesters;
