import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Table, Button, Typography, Space } from 'antd';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { MenuOutlined, CloseOutlined, DownloadOutlined } from '@ant-design/icons';
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
    downloadLoading: boolean,
    dataLoading: boolean,
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
            downloadLoading: false,
            dataLoading: false,
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
                title: 'Type',
                dataIndex: '',
                width: 240,
                render: (record: IRecord) => {
                    const {
                        time,
                        event: {
                            type
                        }
                    } = record;
                    return (
                        <Space direction="vertical">
                            <Text>{type}</Text>
                            <Text type="secondary">{moment(time).format('L HH:mm:ss SSS')}</Text>
                        </Space>
                    );
                },
            },
            {
                title: 'Event',
                dataIndex: 'setup',
                width: 430,
                render: (setup: IRecord['setup']) => {
                    return (
                        <Space direction="vertical">
                            <Text>{setup?.xpath || setup?.url}</Text>
                            <ReactJson src={setup || {}} theme='rjv-default' collapsed={true} />
                        </Space>
                    );
                }
            },
        ];
    };

    onSortEnd({ oldIndex, newIndex }: any): void {
        const { dataSource } = this.state;
        if (oldIndex !== newIndex) {
            const newData = arrayMove([].concat(dataSource as any), oldIndex, newIndex).filter(el => !!el);
            this.setState({ dataSource: newData });
        }
    }

    onSelectChange(selectedRowKeys: any): void {
        this.setState({ selectedRowKeys });
    }

    deleteRows(): void {
        const { dataSource, selectedRowKeys } = this.state;
        const newData = dataSource.filter((_, index: number) => !selectedRowKeys.includes(index.toString()));
        this.setState({ selectedRowKeys: [], dataSource: newData });
    }

    downloadJson(): void {

    }

    DraggableContainer(props: IProps) {
        return (<CSortableContainer
            useDragHandle
            disableAutoscroll
            helperClass='row-dragging'
            onSortEnd={({ oldIndex, newIndex }: any) => this.onSortEnd({ oldIndex, newIndex })}
            {...props}
        />);
    }

    DraggableBodyRow({ className, style, ...restProps }: any) {
        return (<CSortableItem index={restProps['data-row-key']} {...restProps} />);
    }

    render() {
        const { dataSource, selectedRowKeys, downloadLoading, dataLoading } = this.state;

        const rowSelection = {
            selectedRowKeys,
            onChange: (keys: any) => this.onSelectChange(keys),
        };

        return (
            <Space direction="vertical">
                <Space direction="horizontal">
                    {
                        selectedRowKeys.length > 0 && 
                        <>
                            <Button
                                type="text"
                                onClick={() => this.setState({ selectedRowKeys: [] })}
                                icon={<CloseOutlined />}
                            />
                            <Text strong>{selectedRowKeys.length || 0} of {dataSource.length || 0} items selected</Text>
                            <Button
                                danger
                                onClick={() => this.deleteRows()}
                            >
                                Delete {selectedRowKeys.length || 0} item(s)
                            </Button>
                        </>
                    }
                    {
                        !selectedRowKeys.length && 
                        <Text strong>{dataSource.length || 0} items</Text>
                    }
                    <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        loading={downloadLoading}
                        onClick={() => this.downloadJson()}
                    >
                        Download
                    </Button>
                </Space>
                <Table
                    pagination={false}
                    dataSource={dataSource}
                    columns={this.columns}
                    rowKey={(_, index) => `${index}`}
                    rowSelection={rowSelection}
                    components={{
                        body: {
                            wrapper: (props: IProps) => this.DraggableContainer(props),
                            row: (props: IProps) => this.DraggableBodyRow(props),
                        },
                    }}
                    loading={dataLoading}
                />
            </Space>
        );
    }
}

export default Home;
