import React, { FC } from 'react';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import { useHistory } from 'react-router-dom';
import { Breadcrumb, Button } from 'antd'

interface Props {
  breadcrumbs: any[];
}

const Breadcrumbs: FC<Props> = ({ breadcrumbs }) => {
  const history = useHistory();
  return (
    <Breadcrumb style={{ display: 'inline-block' }}>
      {breadcrumbs.map((bc: CommonObjectType, index: number) => {
        return (
          <Breadcrumb.Item key={bc.key}>
            <Button
              disabled={
                (!bc.exact && bc.match.path !== '/') ||
                index === breadcrumbs.length - 1
              }
              onClick={() => {
                history.push(bc.match.path)
              }}
              style={{ padding: '0' }}
              type="link"
            >
              {bc.name}
            </Button>
          </Breadcrumb.Item>
        )
      })}
    </Breadcrumb>
  )

}


export default withBreadcrumbs()(Breadcrumbs)