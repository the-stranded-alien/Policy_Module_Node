const Sequelize = require('sequelize');

// Defining the Database Properties
const db = new Sequelize(
    'userdb',
    'userdb',
    'userdb',
    {
        dialect: 'mysql',
        host: 'localhost',
        logging: false
    }   
)

// Users Table Schema
const Users = db.define('users', {
    username: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING
})

// Risks Table Schema
const Risks = db.define('risks', {
    risk_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    risk_title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    },
    keywords: {
        type: Sequelize.STRING,
        defaultValue: null
    },
    description: {
        type: Sequelize.STRING,
        defaultValue: null,
        allowNull: true
    },
    regex: {
        type: Sequelize.STRING,
        defaultValue: null
    },
    risk_match_count: {
        type: Sequelize.INTEGER,
        defaultValue: 1
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

// Defining Relation Between Users & Risks Table
Users.hasMany(Risks, {
    foreignKey: 'username',
    allowNull: false
});
Risks.belongsTo(Users, { 
    foreignKey: 'username',
    allowNull: false
});

// Policies Table Schema
const Policies = db.define('policies', {
    policy_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    policy_name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    remedy_type: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
    },
    remedy_time: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
    },
    on_remedy_user: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    on_remedy_admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    admin_email: {
        type: Sequelize.STRING,
        defaultValue: null
    },
    admin_subject: {
        type: Sequelize.STRING,
        defaultValue: null
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

// Defining Relation Between Users & Policies Table
Users.hasMany(Policies, {
    foreignKey: 'username',
    allowNull: false 
});
Policies.belongsTo(Users, {
    foreignKey: 'username',
    allowNull: false
});

// Policy - Risks Mapping Table Schema
const PolicyRisk = db.define('policyrisk', {
    policy_risk_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    policy_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Policies,
            key: 'policy_id'
        }
    },
    risk_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Risks,
            key: 'risk_id'
        }
    }
})

// Defining Relations Between Policies & Risks Table
Risks.belongsToMany(Policies, { 
    foreignKey: 'risk_id',
    through: PolicyRisk,
    allowNull: false 
});
Policies.belongsToMany(Risks, { 
    foreignKey: 'policy_id',
    through: PolicyRisk,
    allowNull: false
});

// Tasks Record Table Schema
const Tasks = db.define('tasks', {
    task_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    policies: {
        type: Sequelize.STRING,
        allowNull: false
    },
    file_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    file_data: {
        type: Sequelize.STRING,
        allowNull: false
    },
    result: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

Users.hasMany(Tasks, {
    foreignKey: 'username',
    allowNull: false 
});
Tasks.belongsTo(Users, {
    foreignKey: 'username',
    allowNull: false
});

// Syncing The Database
db.sync().then(() => console.log("Database Is Ready"))

exports = module.exports = {
    db,
    Users,
    Risks,
    Policies,
    PolicyRisk,
    Tasks
}