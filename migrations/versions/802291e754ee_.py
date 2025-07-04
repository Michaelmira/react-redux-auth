"""empty message

Revision ID: 802291e754ee
Revises: 
Create Date: 2025-07-01 20:09:39.312583

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '802291e754ee'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('customers',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password', sa.String(length=80), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('first_name', sa.String(length=120), nullable=False),
    sa.Column('last_name', sa.String(length=120), nullable=False),
    sa.Column('address', sa.String(length=250), nullable=False),
    sa.Column('phone', sa.String(length=120), nullable=False),
    sa.Column('verification_code', sa.Integer(), nullable=True),
    sa.Column('verification_code_expires', sa.DateTime(), nullable=True),
    sa.Column('reset_token', sa.String(length=120), nullable=True),
    sa.Column('token_created_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password', sa.String(length=80), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('first_name', sa.String(length=120), nullable=False),
    sa.Column('last_name', sa.String(length=120), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('work_orders',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('customer_id', sa.Integer(), nullable=False),
    sa.Column('make', sa.String(length=120), nullable=False),
    sa.Column('model', sa.String(length=120), nullable=False),
    sa.Column('year', sa.String(length=4), nullable=False),
    sa.Column('color', sa.String(length=120), nullable=False),
    sa.Column('vin', sa.String(length=50), nullable=False),
    sa.Column('license_plate', sa.String(length=120), nullable=False),
    sa.Column('wo_stages', sa.ARRAY(sa.String(length=255)), nullable=True),
    sa.Column('current_stage', sa.String(), nullable=False),
    sa.Column('time_created', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('time_updated', sa.DateTime(timezone=True), nullable=True),
    sa.Column('est_completion', sa.Date(), nullable=False),
    sa.ForeignKeyConstraint(['customer_id'], ['customers.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('work_orders')
    op.drop_table('users')
    op.drop_table('customers')
    # ### end Alembic commands ###
