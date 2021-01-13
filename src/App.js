import { Client } from '@stomp/stompjs';
import { Component } from 'react';
import { RadialChart } from 'react-vis';

class App extends Component {
  state = {
    sessions: [],
  };

  componentDidMount() {
    this.client = new Client();

    this.client.configure({
      brokerURL: 'ws://localhost:8080/socket',
      onConnect: () => {
        console.log('onConnect');

        this.client.subscribe('/sessions/config', (message) => {
          const sessions = JSON.parse(message.body);
          const chartSessions = sessions.map((session) => {
            const obj = [];
            obj.push({
              angle: session.approved,
              label: 'Aprobadas',
            });

            obj.push({
              angle: session.disapproved,
              label: 'Rechazadas',
            });

            return obj;
          });

          this.setState({ sessions: chartSessions });
        });
      },
    });

    this.client.activate();
  }

  render() {
    console.log('Render')
    const elements = this.state.sessions;

    return (
      <ul>
        {elements.map((value, index) => {
          return <RadialChart data={value} width={300} height={300} showLabels={true} animation={true} />;
        })}
      </ul>
    );
  }
}

export default App;
