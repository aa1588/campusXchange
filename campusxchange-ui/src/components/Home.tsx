import { Component } from "react";


type Props = {};

type State = {
}

export default class Home extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <h1>CampusXchange</h1>
        </header>
      </div>
    );
  }
}
