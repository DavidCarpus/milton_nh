import React from 'react';
 import SmartLink from './SmartLink'

export default class DocumentList extends React.Component {
    componentWillMount() {
        this.props.fetchDocs(this.props.group.link);
    }

    render() {
        var groupName= this.props.group.link
        var id = groupName + '_Documents'
        //   console.log('*******DocumentList************');
        //   console.log(JSON.stringify(this.props.currentGroupName));
        //   console.log(JSON.stringify(this.props));
        //   console.log('*******************');

        // if ( this.props.documentsGroupName &&  this.props.documentsGroupName !=  this.props.group.link ) {
        //     this.props.fetchDocs(this.props.group.link);
        // }
      if ( this.props.loading) {
          console.log('***DepartmentsUI loading. ');
          return (<div>Loading</div>)
      }
        return (
            <div id={id}>
                {this.props.documents.length > 0 ? <h2>{this.props.title} </h2> : ''}
                {this.props.documents.
                    map( (document, index) =>
                        <div key={index} >
                            <SmartLink link={document.link} linkText={document.desc || document.link} />
                        </div>
                    )}

            </div>
        )
    }
}
