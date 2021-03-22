import React from 'react';
import { Empty } from 'antd';

class Stats extends React.Component {
    render() {
        return (
            <Empty
                description={
                    <span>
                        Go to a <a href="/">Home page</a>
                    </span>
                }
            >
            </Empty>
        );
    }
}

export default Stats;
