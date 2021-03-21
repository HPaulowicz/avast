import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Table } from 'antd';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { MenuOutlined } from '@ant-design/icons';
import arrayMove from 'array-move';

interface IProps extends RouteComponentProps {};
interface IState {
    dataSource: any,
};

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);

const columns = [
    {
        title: 'Sort',
        dataIndex: 'sort',
        width: 30,
        className: 'drag-visible',
        render: () => <DragHandle />,
    },
    {
        title: 'Name',
        dataIndex: 'name',
        className: 'drag-visible',
    },
    {
        title: 'Age',
        dataIndex: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
    },
];

const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        index: 0,
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        index: 1,
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        index: 2,
    },
];

const CSortableItem = SortableElement((props: any) => <tr {...props} />);
const CSortableContainer = SortableContainer((props: any) => <tbody {...props} />);

class Home extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            dataSource: data,
        };
    }

    onSortEnd = ({ oldIndex, newIndex }: any) => {
        const { dataSource } = this.state;
        if (oldIndex !== newIndex) {
            const newData = arrayMove([].concat(dataSource), oldIndex, newIndex).filter(el => !!el);
            console.log('Sorted items: ', newData);
            this.setState({ dataSource: newData });
        }
    };

    DraggableContainer = (props: IProps) => (
        <CSortableContainer
            useDragHandle
            disableAutoscroll
            helperClass="row-dragging"
            onSortEnd={this.onSortEnd}
            {...props}
        />
    );

    DraggableBodyRow = ({ className, style, ...restProps }: any) => {
        const { dataSource } = this.state;
        // function findIndex base on Table rowKey props and should always be a right array index
        const index = dataSource.findIndex((x: any) => x.index === restProps['data-row-key']);
        return <CSortableItem index={index} {...restProps} />;
    };

    render() {
        const { dataSource } = this.state;

        return (
            <Table
                pagination={false}
                dataSource={dataSource}
                columns={columns}
                rowKey="index"
                components={{
                    body: {
                        wrapper: this.DraggableContainer,
                        row: this.DraggableBodyRow,
                    },
                }}
            />
        );
    }
}

export default Home;
