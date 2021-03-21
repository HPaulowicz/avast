import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Table, Button, Typography } from 'antd';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { MenuOutlined } from '@ant-design/icons';
import arrayMove from 'array-move';
import ReactJson from 'react-json-view';
import moment from 'moment';

import * as dataJSON from '../../../assets/task.recording.json';

const { Text } = Typography;

interface IRecord {
    event: {
        type: string,
    },
    setup?: {
        attributes?: {
            title?: string,
            autofocus?: string,
            class?: string,
            id?: string,
            name?: string,
            placeholder?: string,
            'rcrdr-extra-style'?: {
                display?: string,
                visibility?: string,
                [key: string]: any,
            },
            required?: string,
            type?: string,
            pattern?: string,
            value?: string,
            tabindex?: string,
            href?: string,
            role?: string,
            alt?: string,
            height?: string,
            src?: string,
            srcset?: string,
            width?: string,
            'data-sc-fieldtype'?: string,
            'data-sc-fieldtype-id'?: string,
            'data-target'?: string,
            'data-action'?: string,
            'data-validation-name'?: string,
            'data-behavior'?: string,
            'data-appearing-on'?: string,
            'data-bucket-id'?: string,
            'data-bucket-url'?: string,
            'data-role'?: string,
            'data-disable-with'?: string,
            'aria-haspopup'?: boolean,
            'aria-label'?: string,
            'data-current-person-avatar'?: boolean,
            [key: string]: any,
        },
        description?: string,
        name?: string,
        type?: string,
        url?: string,
        altPath?: string,
        altSelector?: string,
        computedRole?: string,
        frame?: string,
        frame_id?: string,
        html?: string,
        nodeName?: string,
        nodeType?: string,
        rootpath?: string,
        selector?: string,
        xpath?: string,
        maxLength?: number,
        minLength?: number,
        pattern?: string,
        value?: string,
        required?: boolean,
        [key: string]: any,
    },
    time: number,
};

interface IProps extends RouteComponentProps { };
interface IState {
    dataSource: IRecord[],
    selectedRowKeys: any[],
};

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
const CSortableItem = SortableElement((props: any) => <tr {...props} />);
const CSortableContainer = SortableContainer((props: any) => <tbody {...props} />);

class Home extends React.Component<IProps, IState> {
    private columns: any;

    constructor(props: IProps) {
        super(props);

        this.state = {
            dataSource: dataJSON.records as IRecord[],
            selectedRowKeys: [],
        };

        this.columns = [
            {
                title: '',
                dataIndex: 'sort',
                width: 30,
                className: 'drag-visible',
                render: () => <DragHandle />,
            },
            {
                title: 'Event',
                dataIndex: 'event',
                className: 'drag-visible',
                render: ({ type }: IRecord['event']) => type,
            },
            {
                title: 'Timestamp',
                dataIndex: 'time',
                render: (time: IRecord['time']) => moment(time).format('L HH:mm:ss SSS'),
            },
            {
                title: 'Event data',
                dataIndex: 'setup',
                render: (setup: IRecord['setup']) => <ReactJson src={setup || {}} theme='monokai' collapsed={true} />,
            },
        ];
    };

    onSortEnd({ oldIndex, newIndex }: any) {
        const { dataSource } = this.state;
        if (oldIndex !== newIndex) {
            const newData = arrayMove([].concat(dataSource as any), oldIndex, newIndex).filter(el => !!el);
            console.log('Sorted items: ', newData);
            this.setState({ dataSource: newData });
        }
    }

    onSelectChange(selectedRowKeys: any) {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

    deleteRows() {
        const { dataSource, selectedRowKeys } = this.state;
        const newData = dataSource.filter((_, index: number) => !selectedRowKeys.includes(index.toString()));
        this.setState({ selectedRowKeys: [], dataSource: newData });
    }

    DraggableContainer = (props: IProps) => (
        <CSortableContainer
            useDragHandle
            disableAutoscroll
            helperClass='row-dragging'
            onSortEnd={(...args: any) => this.onSortEnd(args)}
            {...props}
        />
    );

    DraggableBodyRow = ({ className, style, ...restProps }: any) => (<CSortableItem index={restProps['data-row-key']} {...restProps} />);

    render() {
        const { dataSource, selectedRowKeys } = this.state;

        const rowSelection = {
            selectedRowKeys,
            onChange: (keys: any) => this.onSelectChange(keys),
        };

        return (
            <>
                <Text strong>{selectedRowKeys.length || 0} of {dataSource.length || 0} items selected</Text>
                <Button
                    danger
                    disabled={!selectedRowKeys.length}
                    onClick={() => this.deleteRows()}
                >
                    Delete {selectedRowKeys.length || 0} items
                </Button>
                <Table
                    pagination={false}
                    dataSource={dataSource}
                    columns={this.columns}
                    rowKey={(_, index) => `${index}`}
                    rowSelection={rowSelection}
                    components={{
                        body: {
                            wrapper: this.DraggableContainer,
                            row: this.DraggableBodyRow,
                        },
                    }}
                />
            </>
        );
    }
}

export default Home;
