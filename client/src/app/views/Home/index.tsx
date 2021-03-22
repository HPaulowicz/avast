import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Table, Button, Typography, Space, Drawer, Statistic, Spin } from 'antd';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { MenuOutlined, CloseOutlined, DownloadOutlined, PieChartTwoTone } from '@ant-design/icons';
import arrayMove from 'array-move';
import ReactJson from 'react-json-view';
import moment from 'moment';

const { Text } = Typography;

interface IStats {
    counts: {
        [key: string]: number,
    },
    timing: {
        min: number,
        max: number,
        mean: number,
    },
    longestSequence: number,
    total: number,
};

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
    statsLoading: boolean,
    drawerVisible: boolean,
    stats?: IStats,
};

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
const CSortableItem = SortableElement((props: any) => <tr {...props} />);
const CSortableContainer = SortableContainer((props: any) => <tbody {...props} />);

class Home extends React.Component<IProps, IState> {
    private columns: any;

    constructor(props: IProps) {
        super(props);

        this.state = {
            dataSource: [],
            selectedRowKeys: [],
            downloadLoading: false,
            dataLoading: false,
            statsLoading: false,
            drawerVisible: false,
            stats: undefined,
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
                        <Space direction='vertical'>
                            <Text>{type}</Text>
                            <Text type='secondary'>{moment(time).format('L HH:mm:ss SSS')}</Text>
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
                        <Space direction='vertical'>
                            <Text>{setup?.xpath || setup?.url}</Text>
                            <ReactJson src={setup || {}} theme='rjv-default' collapsed={true} />
                        </Space>
                    );
                }
            },
        ];
    };

    componentDidMount() {
        this.setState({
            dataLoading: true,
        });
        fetch('http://localhost:8000/task/recording')
            .then(res => res.json())
            .then(
                (result: IRecord[]) => {
                    this.setState({
                        dataLoading: false,
                        dataSource: result
                    });
                },
                (error) => {
                    this.setState({
                        dataLoading: false,
                    });
                }
            );
    }

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

    getDownloadJsonHref(): string {
        const { dataSource } = this.state;

        const json = JSON.stringify(dataSource);
        const blob = new Blob([ json ],{ type: 'application/json' });
        const href = URL.createObjectURL(blob);

        return href;
    }

    showStats(): void {
        this.setState({
            statsLoading: true,
            drawerVisible: true,
        });
        fetch('http://localhost:8000/task/stats')
            .then(res => res.json())
            .then(
                (result: IStats) => {
                    this.setState({
                        statsLoading: false,
                        stats: result
                    });
                },
                (error) => {
                    this.setState({
                        statsLoading: false,
                    });
                }
            );
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
        const {
            drawerVisible,
            statsLoading,
            stats,
            dataSource,
            selectedRowKeys,
            downloadLoading,
            dataLoading,
        } = this.state;

        const rowSelection = {
            selectedRowKeys,
            onChange: (keys: any) => this.onSelectChange(keys),
        };

        return (
            <>
                <Space direction='vertical'>
                    <Space direction='horizontal'>
                        {
                            selectedRowKeys.length > 0 &&
                            <>
                                <Button
                                    type='text'
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
                        <a href={this.getDownloadJsonHref()} download='task.recording.json'>
                            <Button
                                type='primary'
                                icon={<DownloadOutlined />}
                                loading={downloadLoading}
                            >
                                SAVE
                            </Button>
                        </a>
                        <Button
                            type='primary'
                            icon={<PieChartTwoTone />}
                            loading={downloadLoading}
                            onClick={() => this.showStats()}
                        >
                            STATS
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
                <Drawer
                    title='Stats'
                    placement='right'
                    closable={true}
                    visible={drawerVisible}
                    onClose={() => this.setState({ drawerVisible: false })}
                >
                    {
                        statsLoading && <Spin />
                    }
                    {
                        !statsLoading && <Space direction='vertical'>
                            <Statistic title='Min timing between events' value={stats?.timing?.min} suffix='ms' />
                            <Statistic title='Max timing between events' value={stats?.timing?.max} suffix='ms' />
                            <Statistic title='Avg timing between events' value={stats?.timing?.mean} suffix='ms' />
                            <Statistic title='Total interaction time' value={stats?.total} suffix='ms' />
                            <Statistic title='Longest sequence after input event' value={stats?.longestSequence} suffix='ms' />
                            <Text strong>Interaction types:</Text>
                            { Object.keys(stats?.counts || {}).map((item: string) => <Text>{item}: {stats?.counts[item]}</Text>) }
                        </Space>
                    }
                </Drawer>
            </>
        );
    }
}

export default Home;
