import { Button, Dropdown, Table, TableColumnsType, Tag } from "antd";
import { TSemester } from "../../../types";
import { useGetAllRegisteredSemestersQuery } from "../../../redux/features/admin/courseManagement";
import moment from "moment";
export type TTableData = Pick<TSemester, "startDate" | "endDate" | "status">;

const items = [
  { key: "UPCOMING", label: "Upcoming" },
  { key: "ONGOING", label: "Ongoing" },
  { key: "ENDED", label: "Ended" },
];



const RegisteredSemesters = () => {
  // const [params, setParams] = useState<TQueryParam[] | undefined>(undefined);

  const { data: semesterData, isFetching } =
    useGetAllRegisteredSemestersQuery(undefined);

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
    console.log(data);
  }

  const menuProps = {
    items,
    onClick : handleStatusDropdown,
  }

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
      render: () => {
        return (
          <Dropdown menu={menuProps}>
            <Button>Update</Button>
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
