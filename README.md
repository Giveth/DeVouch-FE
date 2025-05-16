# DeVouch Frontend

## 1. Project Overview

### Purpose

DeVouch is a decentralized verification and attestation platform built on the Ethereum blockchain. The frontend application provides a user-friendly interface for creating, managing, and verifying attestations using the Ethereum Attestation Service (EAS).

### Key Features

-   Web3 wallet integration for secure authentication
-   Attestation creation and management
-   Real-time verification of attestations
-   Responsive and modern UI built with Next.js and Tailwind CSS

### Live Links

-   Production: [https://devouch.xyz/](https://devouch.xyz/)
-   Staging: [https://staging.devouch.xyz/](https://staging.devouch.xyz/)

## 2. Architecture Overview

### System Diagram

```mermaid
graph TD
    A[Frontend] --> B[Ethereum Blockchain]
    A --> C[Ethereum Attestation Service]
    A --> D[Web3Modal]
    A --> E[React Query]
```

### Tech Stack

-   **Framework**: Next.js 14.2.3
-   **UI**: React 18, Tailwind CSS
-   **State Management**: React Query
-   **Web3 Integration**:
    -   Wagmi
    -   Viem
    -   Web3Modal
-   **Attestation Service**: EAS SDK
-   **Language**: TypeScript

### Data Flow

1. User connects wallet via Web3Modal
2. Frontend interacts with EAS SDK for attestation operations
3. React Query manages data fetching and caching
4. Wagmi handles blockchain interactions
5. UI components render attestation data and user interactions

## 3. Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   Yarn package manager
-   Web3 wallet (MetaMask, WalletConnect, etc.)

### Installation Steps

1. Clone the repository:

    ```bash
    git clone https://github.com/your-org/devouch-fe.git
    cd devouch-fe
    ```

2. Install dependencies:

    ```bash
    yarn install
    ```

3. Copy environment variables:

    ```bash
    cp .env.example .env.local
    ```

4. Update environment variables in `.env.local` with your configuration

### Configuration

Required environment variables:

-   `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: Your WalletConnect project ID
-   `NEXT_PUBLIC_EAS_CONTRACT_ADDRESS`: EAS contract address
-   `NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS`: Schema registry contract address

## 4. Usage Instructions

### Running the Application

Development mode:

```bash
yarn dev
```

Production build:

```bash
yarn build
yarn start
```

### Testing

Run linting:

```bash
yarn lint
```

### Common Tasks

-   Creating new attestations
-   Verifying existing attestations
-   Managing wallet connections
-   Viewing attestation history

## 5. Deployment Process

### Environments

-   Development: Local development
-   Staging: Pre-production testing
-   Production: Live application

### Deployment Steps

1. Build the application:

    ```bash
    yarn build
    ```

2. Deploy to your hosting platform (e.g., Vercel)

### CI/CD Integration

-   Automated builds on main branch
-   Pre-deployment checks
-   Environment-specific configurations

## 6. Troubleshooting

### Common Issues

1. **Wallet Connection Issues**

    - Clear browser cache
    - Ensure wallet is properly configured
    - Check network connectivity

2. **Attestation Creation Failures**
    - Verify wallet has sufficient funds
    - Check network congestion
    - Ensure correct contract addresses

### Logs and Debugging

-   Browser console logs
-   Network request monitoring
-   Transaction status tracking

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
