import React from 'react';
import { Card, Col } from 'react-bootstrap';
import { ReferenceForm } from './NewReference'

type PreviewNewReferenceProps = {
    data: ReferenceForm
}
const PreviewNewReference : React.FC<PreviewNewReferenceProps> = ({data}) => {
    return (
        <Col >
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="text-primary">{data.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {data.type.charAt(0).toUpperCase() + data.type.slice(1)} - {data.year}
              </Card.Subtitle>
              <Card.Text>
                {data.authorIds && data.authorIds.length > 0 && (
                  <div>
                    <strong>Author IDs:</strong> {data.authorIds.join(", ")}
                  </div>
                )}
                {data.newAuthors && data.newAuthors.length > 0 && (
                  <div>
                    <strong>New Authors:</strong> {data.newAuthors.join(", ")}
                  </div>
                )}
                {data.newArticle && (
                  <div>
                    <strong>New Article:</strong> {JSON.stringify(data.newArticle)}
                  </div>
                )}
                {data.cityId && (
                  <div>
                    <strong>City ID:</strong> {data.cityId}
                  </div>
                )}
                {data.newCity && (
                  <div>
                    <strong>New City:</strong> {data.newCity}
                  </div>
                )}
                {data.other && (
                  <div>
                    <strong>Other:</strong> {data.other}
                  </div>
                )}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      );
    };
export default PreviewNewReference